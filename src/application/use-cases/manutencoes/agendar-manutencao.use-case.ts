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
import {
  Manutencao,
  StatusManutencao,
  TipoManutencao,
} from '../../../domain/entities/manutencao.entity';

export interface AgendarManutencaoData {
  maquinaId: number;
  tipo: TipoManutencao;
  descricao: string;
  dataAgendada: Date;
  responsavelId?: number;
  custoEstimado?: number;
  observacoes?: string;
}

@Injectable()
export class AgendarManutencaoUseCase {
  constructor(
    @Inject(MAQUINAS_REPOSITORY_TOKEN)
    private readonly maquinasRepository: IMaquinasRepository,
    @Inject(MANUTENCOES_REPOSITORY_TOKEN)
    private readonly manutencoesRepository: IManutencoesRepository,
  ) {}

  async execute(
    data: AgendarManutencaoData,
  ): Promise<{ maquina: Maquina; manutencao: Manutencao }> {
    // Verificar se a máquina existe
    const maquina = await this.maquinasRepository.findOne(data.maquinaId);
    if (!maquina) {
      throw new Error('Máquina não encontrada');
    }

    // Verificar se já existe manutenção agendada para a mesma data
    const manutencoesAgendadas =
      await this.manutencoesRepository.findAgendadas();
    const conflito = manutencoesAgendadas.find(
      (m) =>
        m.maquinaId === data.maquinaId &&
        m.dataAgendada.toDateString() === data.dataAgendada.toDateString(),
    );

    if (conflito) {
      throw new Error(
        'Já existe manutenção agendada para esta máquina nesta data',
      );
    }

    // Criar agendamento
    const manutencao = await this.manutencoesRepository.create({
      maquinaId: data.maquinaId,
      tipo: data.tipo,
      descricao: data.descricao,
      dataAgendada: data.dataAgendada,
      custoEstimado: data.custoEstimado,
      responsavelId: data.responsavelId,
      observacoes: data.observacoes,
    });

    return { maquina, manutencao };
  }
}
