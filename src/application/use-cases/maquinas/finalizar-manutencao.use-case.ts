import { Injectable, Inject } from '@nestjs/common';
import {
  IMaquinasRepository,
  MAQUINAS_REPOSITORY_TOKEN,
} from '../../../domain/repositories/maquinas.repository.interface';
import {
  IManutencoesRepository,
  MANUTENCOES_REPOSITORY_TOKEN,
} from '../../../domain/repositories/manutencoes.repository.interface';
import {
  Maquina,
  StatusMaquina,
} from '../../../domain/entities/maquina.entity';
import { StatusManutencao } from '../../../domain/entities/manutencao.entity';

export interface FinalizarManutencaoData {
  resultado: string;
  custoReal?: number;
  observacoes?: string;
  proximaManutencao?: Date;
}

@Injectable()
export class FinalizarManutencaoUseCase {
  constructor(
    @Inject(MAQUINAS_REPOSITORY_TOKEN)
    private readonly maquinasRepository: IMaquinasRepository,
    @Inject(MANUTENCOES_REPOSITORY_TOKEN)
    private readonly manutencoesRepository: IManutencoesRepository,
  ) {}

  async execute(
    id: number,
    manutencaoData: FinalizarManutencaoData,
  ): Promise<{ maquina: Maquina; manutencao: any }> {
    // Verificar se a máquina existe
    const maquina = await this.maquinasRepository.findOne(id);
    if (!maquina) {
      throw new Error('Máquina não encontrada');
    }

    // Verificar se a máquina está em manutenção
    if (maquina.status !== StatusMaquina.MANUTENCAO) {
      throw new Error(
        'Apenas máquinas em manutenção podem ter a manutenção finalizada',
      );
    }

    // Buscar manutenção em andamento da máquina
    const manutencoesEmAndamento =
      await this.manutencoesRepository.findByStatus(
        StatusManutencao.EM_ANDAMENTO,
      );
    const manutencaoAtiva = manutencoesEmAndamento.find(
      (m) => m.maquinaId === id,
    );

    if (!manutencaoAtiva) {
      throw new Error(
        'Nenhuma manutenção em andamento encontrada para esta máquina',
      );
    }

    // Finalizar manutenção
    const updatedManutencao = await this.manutencoesRepository.update(
      manutencaoAtiva.id,
      {
        status: StatusManutencao.CONCLUIDA,
        dataFim: new Date(),
        custoReal: manutencaoData.custoReal,
        observacoes: manutencaoData.observacoes,
      },
    );

    // Criar histórico da mudança de status
    await this.manutencoesRepository.createHistorico({
      manutencaoId: manutencaoAtiva.id,
      statusAnterior: StatusManutencao.EM_ANDAMENTO,
      statusNovo: StatusManutencao.CONCLUIDA,
      descricao: `Manutenção finalizada: ${manutencaoData.resultado}`,
    });

    // Se há próxima manutenção agendada, criar novo registro
    if (manutencaoData.proximaManutencao) {
      await this.manutencoesRepository.create({
        maquinaId: id,
        tipo: manutencaoAtiva.tipo,
        descricao: 'Manutenção agendada automaticamente',
        dataAgendada: manutencaoData.proximaManutencao,
        observacoes: 'Agendamento automático baseado na manutenção anterior',
      });
    }

    // Liberar máquina para produção
    const updatedMaquina = await this.maquinasRepository.update(id, {
      status: StatusMaquina.DISPONIVEL,
    });

    return { maquina: updatedMaquina, manutencao: updatedManutencao };
  }
}
