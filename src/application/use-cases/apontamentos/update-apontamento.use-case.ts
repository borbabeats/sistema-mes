import { Injectable, Inject } from '@nestjs/common';
import { IApontamentosRepository, UpdateApontamentoData, APONTAMENTOS_REPOSITORY_TOKEN } from '../../../domain/repositories/apontamentos.repository.interface';
import { Apontamento } from '../../../domain/entities/apontamento.entity';
import { FindMaquinaUseCase } from '../maquinas/find-maquina.use-case';
import { FindOrdemProducaoUseCase } from '../ordens-producao/find-ordem-producao.use-case';
import { FindUsuarioUseCase } from '../usuarios/find-usuario.use-case';

@Injectable()
export class UpdateApontamentoUseCase {
  constructor(
    @Inject(APONTAMENTOS_REPOSITORY_TOKEN) private readonly apontamentosRepository: IApontamentosRepository,
    private readonly findMaquinaUseCase: FindMaquinaUseCase,
    private readonly findOrdemProducaoUseCase: FindOrdemProducaoUseCase,
    private readonly findUsuarioUseCase: FindUsuarioUseCase,
  ) {}

  private parseDate(dateString?: string | null): Date | null | undefined {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Data inválida');
    }
    return date;
  }

  async execute(id: number, data: UpdateApontamentoData): Promise<Apontamento> {
    // Verificar se o apontamento existe
    const apontamento = await this.apontamentosRepository.findOne(id);
    if (!apontamento) {
      throw new Error('Apontamento não encontrado');
    }

    // Validar máquina (se fornecida)
    if (data.maquinaId) {
      const maquina = await this.findMaquinaUseCase.execute(data.maquinaId);
      if (!maquina) {
        throw new Error('Máquina não encontrada');
      }
    }

    // Validar ordem de produção (se fornecida)
    if (data.opId) {
      const ordemProducao = await this.findOrdemProducaoUseCase.execute(data.opId);
      if (!ordemProducao) {
        throw new Error('Ordem de produção não encontrada');
      }
    }

    // Validar usuário (se fornecido)
    if (data.usuarioId) {
      const usuario = await this.findUsuarioUseCase.execute(data.usuarioId);
      if (!usuario) {
        throw new Error('Usuário não encontrado');
      }
    }

    // Converter e validar datas
    const dataInicio = this.parseDate(data.dataInicio);
    const dataFim = this.parseDate(data.dataFim);

    if (dataInicio && dataFim && dataInicio > dataFim) {
      throw new Error('Data de início não pode ser maior que a data de fim');
    }

    // Validar quantidades
    if (data.quantidadeProduzida && data.quantidadeProduzida < 0) {
      throw new Error('Quantidade produzida não pode ser negativa');
    }

    if (data.quantidadeDefeito && data.quantidadeDefeito < 0) {
      throw new Error('Quantidade de defeito não pode ser negativa');
    }

    // Preparar dados para atualização com datas convertidas
    return this.apontamentosRepository.update(id, {
      ...data,
      dataInicio: dataInicio?.toISOString(),
      dataFim: dataFim?.toISOString() || null,
    });
  }
}
