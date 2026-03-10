import { Injectable, Inject } from '@nestjs/common';
import { IMaquinasRepository } from '../../../domain/repositories/maquinas.repository.interface';
import { Maquina } from '../../../domain/entities/maquina.entity';
import { MAQUINAS_REPOSITORY_TOKEN } from '../../../domain/repositories/maquinas.repository.interface';

@Injectable()
export class UpdateHorasUsoUseCase {
  constructor(
    @Inject(MAQUINAS_REPOSITORY_TOKEN) private readonly maquinasRepository: IMaquinasRepository,
  ) {}

  async execute(id: number, horasAdicionais: number): Promise<Maquina> {
    // Verificar se a máquina existe
    const maquina = await this.maquinasRepository.findOne(id);
    if (!maquina) {
      throw new Error('Máquina não encontrada');
    }

    // Validar horas adicionais
    if (horasAdicionais < 0) {
      throw new Error('Horas adicionais não podem ser negativas');
    }

    if (horasAdicionais > 24) {
      throw new Error('Não é possível adicionar mais de 24 horas em um único registro');
    }

    // Atualizar horas de uso
    const updatedMaquina = await this.maquinasRepository.updateHorasUso(id, horasAdicionais);

    return updatedMaquina;
  }
}
