import { Injectable, Inject } from '@nestjs/common';
import { IApontamentosRepository, APONTAMENTOS_REPOSITORY_TOKEN, CreateApontamentoData } from '../../../domain/repositories/apontamentos.repository.interface';
import { Apontamento } from '../../../domain/entities/apontamento.entity';
import { IMaquinasRepository, MAQUINAS_REPOSITORY_TOKEN } from '../../../domain/repositories/maquinas.repository.interface';
import { IOrdensProducaoRepository } from '../../../domain/repositories/ordens-producao.repository.interface';
import { IUsuariosRepository } from '../../../domain/repositories/usuarios.repository.interface';
import { StatusMaquina } from '../../../domain/entities/maquina.entity';
import { StatusOP } from '../../../domain/entities/ordem-producao.entity';
import { ORDENS_PRODUCAO_REPOSITORY_TOKEN } from '../../../ordens-producao/constants';
import { USUARIOS_REPOSITORY_TOKEN } from '../../../users/constants';

@Injectable()
export class CreateApontamentoUseCase {
  constructor(
    @Inject(APONTAMENTOS_REPOSITORY_TOKEN) private readonly apontamentosRepository: IApontamentosRepository,
    @Inject(MAQUINAS_REPOSITORY_TOKEN) private readonly maquinasRepository: IMaquinasRepository,
    @Inject(ORDENS_PRODUCAO_REPOSITORY_TOKEN) private readonly ordensProducaoRepository: IOrdensProducaoRepository,
    @Inject(USUARIOS_REPOSITORY_TOKEN) private readonly usuariosRepository: IUsuariosRepository,
  ) {}

  async execute(data: CreateApontamentoData): Promise<Apontamento> {
    // Validações de negócio
    const maquina = await this.maquinasRepository.findOne(data.maquinaId);
    if (!maquina) {
      throw new Error('Máquina não encontrada');
    }

    const ordemProducao = await this.ordensProducaoRepository.findOne(data.opId);
    if (!ordemProducao) {
      throw new Error('Ordem de produção não encontrada');
    }

    const usuario = await this.usuariosRepository.findOne(data.usuarioId);
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    // Verificar se a máquina está disponível para produção
    if (!maquina.canStartProduction()) {
      throw new Error('Máquina não está disponível para produção');
    }

    // Verificar se a ordem de produção pode ser iniciada
    if (!ordemProducao.canStart()) {
      throw new Error('Ordem de produção não pode ser iniciada');
    }

    // Criar apontamento
    const apontamento = new Apontamento({
      ...data,
      quantidadeProduzida: data.quantidadeProduzida || 0,
      quantidadeDefeito: data.quantidadeDefeito || 0,
    });

    if (!apontamento.isValid()) {
      throw new Error('Dados do apontamento inválidos');
    }

    // Atualizar status da máquina para EM_USO
    await this.maquinasRepository.update(data.maquinaId, { status: StatusMaquina.EM_USO });

    // Iniciar ordem de produção se ainda não estiver em andamento
    if (ordemProducao.isPending()) {
      await this.ordensProducaoRepository.update(data.opId, {
        status: StatusOP.EM_ANDAMENTO,
        dataInicioReal: data.dataInicio,
      });
    }

    return this.apontamentosRepository.create(apontamento);
  }
}
