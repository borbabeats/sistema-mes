import { Injectable, Inject } from '@nestjs/common';
import {
  IManutencoesRepository,
  MANUTENCOES_REPOSITORY_TOKEN,
} from '../../../domain/repositories/manutencoes.repository.interface';
import {
  Manutencao,
  StatusManutencao,
} from '../../../domain/entities/manutencao.entity';

export interface CancelarManutencaoData {
  motivo: string;
  observacoes?: string;
}

@Injectable()
export class CancelarManutencaoUseCase {
  constructor(
    @Inject(MANUTENCOES_REPOSITORY_TOKEN)
    private readonly manutencoesRepository: IManutencoesRepository,
  ) {}

  async execute(id: number, data: CancelarManutencaoData): Promise<Manutencao> {
    // Verificar se a manutenção existe
    const manutencao = await this.manutencoesRepository.findOne(id);
    if (!manutencao) {
      throw new Error('Manutenção não encontrada');
    }

    // Verificar se a manutenção pode ser cancelada
    if (manutencao.status === StatusManutencao.CONCLUIDA) {
      throw new Error('Manutenção já concluída não pode ser cancelada');
    }

    if (manutencao.status === StatusManutencao.CANCELADA) {
      throw new Error('Manutenção já está cancelada');
    }

    const statusAnterior = manutencao.status;

    // Cancelar manutenção
    const updatedManutencao = await this.manutencoesRepository.update(id, {
      status: StatusManutencao.CANCELADA,
      dataFim: new Date(),
      observacoes: data.observacoes,
    });

    // Criar histórico da mudança de status
    await this.manutencoesRepository.createHistorico({
      manutencaoId: id,
      statusAnterior,
      statusNovo: StatusManutencao.CANCELADA,
      descricao: `Manutenção cancelada: ${data.motivo}`,
    });

    return updatedManutencao;
  }
}
