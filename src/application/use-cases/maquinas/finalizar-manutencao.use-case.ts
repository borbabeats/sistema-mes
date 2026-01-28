import { Injectable, Inject } from '@nestjs/common';
import { IMaquinasRepository } from '../../../domain/repositories/maquinas.repository.interface';
import { Maquina, StatusMaquina } from '../../../domain/entities/maquina.entity';
import { MAQUINAS_REPOSITORY_TOKEN } from '../../../domain/repositories/maquinas.repository.interface';

export interface FinalizarManutencaoData {
  resultado: string;
  observacoes?: string;
  proximaManutencao?: Date;
}

@Injectable()
export class FinalizarManutencaoUseCase {
  constructor(
    @Inject(MAQUINAS_REPOSITORY_TOKEN) private readonly maquinasRepository: IMaquinasRepository,
  ) {}

  async execute(id: number, manutencaoData: FinalizarManutencaoData): Promise<Maquina> {
    // Verificar se a máquina existe
    const maquina = await this.maquinasRepository.findOne(id);
    if (!maquina) {
      throw new Error('Máquina não encontrada');
    }

    // Verificar se a máquina está em manutenção
    if (maquina.status !== StatusMaquina.MANUTENCAO) {
      throw new Error('Apenas máquinas em manutenção podem ter a manutenção finalizada');
    }

    // Finalizar manutenção e colocar como disponível
    const updatedMaquina = await this.maquinasRepository.update(id, {
      status: StatusMaquina.DISPONIVEL,
    });

    return updatedMaquina;
  }
}
