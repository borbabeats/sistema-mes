import { Injectable, Inject } from '@nestjs/common';
import { IApontamentosRepository, CreateApontamentoData, CreateApontamentoInternalData, APONTAMENTOS_REPOSITORY_TOKEN } from '../../../domain/repositories/apontamentos.repository.interface';
import { Apontamento } from '../../../domain/entities/apontamento.entity';
import { FindMaquinaUseCase } from '../maquinas/find-maquina.use-case';
import { FindOrdemProducaoUseCase } from '../ordens-producao/find-ordem-producao.use-case';
import { FindUsuarioUseCase } from '../usuarios/find-usuario.use-case';
import { UpdateStatusMaquinaUseCase } from '../maquinas/update-status-maquina.use-case';
import { IniciarProducaoUseCase } from '../ordens-producao/iniciar-producao.use-case';
import { UpdateQuantidadeProduzidaUseCase } from '../ordens-producao/update-quantidade-produzida.use-case';
import { StatusMaquina } from '../../../domain/entities/maquina.entity';

@Injectable()
export class CreateApontamentoUseCase {
  constructor(
    @Inject(APONTAMENTOS_REPOSITORY_TOKEN) private readonly apontamentosRepository: IApontamentosRepository,
    private readonly findMaquinaUseCase: FindMaquinaUseCase,
    private readonly findOrdemProducaoUseCase: FindOrdemProducaoUseCase,
    private readonly findUsuarioUseCase: FindUsuarioUseCase,
    private readonly updateStatusMaquinaUseCase: UpdateStatusMaquinaUseCase,
    private readonly iniciarProducaoUseCase: IniciarProducaoUseCase,
    private readonly updateQuantidadeProduzidaUseCase: UpdateQuantidadeProduzidaUseCase,
  ) {}

  private parseDate(dateString: string): Date {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Data inválida');
    }
    return date;
  }

  async execute(data: CreateApontamentoData): Promise<Apontamento> {
    // Validações de negócio
    const maquina = await this.findMaquinaUseCase.execute(data.maquinaId);
    if (!maquina) {
      throw new Error('Máquina não encontrada');
    }

    const ordemProducao = await this.findOrdemProducaoUseCase.execute(data.opId);
    if (!ordemProducao) {
      throw new Error('Ordem de produção não encontrada');
    }

    const usuario = await this.findUsuarioUseCase.execute(data.usuarioId);
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    // Validar quantidades
    if (data.quantidadeProduzida && data.quantidadeProduzida < 0) {
      throw new Error('Quantidade produzida não pode ser negativa');
    }

    if (data.quantidadeDefeito && data.quantidadeDefeito < 0) {
      throw new Error('Quantidade de defeito não pode ser negativa');
    }

    // Converter e validar data
    const dataInicio = this.parseDate(data.dataInicio);
    const agora = new Date();
    
    // Ajustar para comparação apenas de datas (ignorar horas/minutos)
    const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
    const dataInicioAjustada = new Date(dataInicio.getFullYear(), dataInicio.getMonth(), dataInicio.getDate());
    
    if (dataInicioAjustada < hoje) {
      throw new Error('Data de início não pode ser no passado');
    }

    const dataFim = data.dataFim ? this.parseDate(data.dataFim) : null;

    // Validar período se dataFim fornecida
    if (dataFim && dataInicio > dataFim) {
      throw new Error('Data de início não pode ser maior que a data de fim');
    }

    // Preparar dados para criação com datas convertidas
    const createData: CreateApontamentoInternalData = {
      ...data,
      dataInicio,
      dataFim,
    };

    // Atualizar status da máquina para EM_USO
    await this.updateStatusMaquinaUseCase.execute(data.maquinaId, StatusMaquina.EM_USO);

    // Iniciar ordem de produção se ainda não estiver em andamento
    if (ordemProducao.status === 'RASCUNHO' || ordemProducao.status === 'PLANEJADA') {
      await this.iniciarProducaoUseCase.execute(ordemProducao.id);
    }

    const createdApontamento = await this.apontamentosRepository.create({
      ...createData,
      dataInicio: createData.dataInicio.toISOString(),
      dataFim: createData.dataFim?.toISOString() || null,
    });

    return createdApontamento;
  }
}
