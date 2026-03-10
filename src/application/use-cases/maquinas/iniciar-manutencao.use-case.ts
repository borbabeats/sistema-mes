import { Injectable, Inject } from '@nestjs/common';
import { IMaquinasRepository, MAQUINAS_REPOSITORY_TOKEN } from '../../../domain/repositories/maquinas.repository.interface';
import { IManutencoesRepository, MANUTENCOES_REPOSITORY_TOKEN } from '../../../domain/repositories/manutencoes.repository.interface';
import { Maquina, StatusMaquina } from '../../../domain/entities/maquina.entity';
import { Manutencao, TipoManutencao, StatusManutencao } from '../../../domain/entities/manutencao.entity';

export interface IniciarManutencaoData {
  tipo: TipoManutencao;
  descricao: string;
  dataAgendada?: Date;
  previsaoTermino?: Date;
  responsavelId?: number;
  custoEstimado?: number;
  observacoes?: string;
}

@Injectable()
export class IniciarManutencaoUseCase {
  constructor(
    @Inject(MAQUINAS_REPOSITORY_TOKEN) private readonly maquinasRepository: IMaquinasRepository,
    @Inject(MANUTENCOES_REPOSITORY_TOKEN) private readonly manutencoesRepository: IManutencoesRepository,
  ) {}

  async execute(id: number, manutencaoData: IniciarManutencaoData): Promise<{ maquina: Maquina; manutencao: Manutencao }> {
    // Verificar se a máquina existe
    const maquina = await this.maquinasRepository.findOne(id);
    if (!maquina) {
      throw new Error('Máquina não encontrada');
    }

    // Verificar se a máquina pode entrar em manutenção
    if (maquina.status === StatusMaquina.MANUTENCAO) {
      throw new Error('Máquina já está em manutenção');
    }

    if (maquina.status === StatusMaquina.INATIVA || maquina.status === StatusMaquina.DESATIVADA) {
      throw new Error('Máquina inativa ou desativada não pode entrar em manutenção');
    }

    // Criar registro de manutenção
    const manutencao = await this.manutencoesRepository.create({
      maquinaId: id,
      tipo: manutencaoData.tipo,
      descricao: manutencaoData.descricao,
      dataAgendada: manutencaoData.dataAgendada || new Date(),
      custoEstimado: manutencaoData.custoEstimado,
      responsavelId: manutencaoData.responsavelId,
      observacoes: manutencaoData.observacoes,
    });

    // Se a manutenção deve começar imediatamente, atualizar status
    if (!manutencaoData.dataAgendada || manutencaoData.dataAgendada <= new Date()) {
      await this.manutencoesRepository.update(manutencao.id, {
        status: StatusManutencao.EM_ANDAMENTO,
        dataInicio: new Date(),
      });

      // Criar histórico da mudança de status
      await this.manutencoesRepository.createHistorico({
        manutencaoId: manutencao.id,
        statusAnterior: StatusManutencao.AGENDADA,
        statusNovo: StatusManutencao.EM_ANDAMENTO,
        descricao: 'Manutenção iniciada',
      });

      // Atualizar status da máquina
      const updatedMaquina = await this.maquinasRepository.update(id, {
        status: StatusMaquina.MANUTENCAO,
      });

      const updatedManutencao = await this.manutencoesRepository.findOne(manutencao.id);
      if (!updatedManutencao) {
        throw new Error('Erro ao buscar manutenção atualizada');
      }

      return { maquina: updatedMaquina, manutencao: updatedManutencao };
    }

    // Apenas agendar manutenção futura, não alterar status da máquina ainda
    return { maquina, manutencao };
  }
}
