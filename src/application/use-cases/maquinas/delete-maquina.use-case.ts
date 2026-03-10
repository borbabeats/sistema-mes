import { Injectable, Inject } from '@nestjs/common';
import { IMaquinasRepository } from '../../../domain/repositories/maquinas.repository.interface';
import { Maquina, StatusMaquina } from '../../../domain/entities/maquina.entity';
import { MAQUINAS_REPOSITORY_TOKEN } from '../../../domain/repositories/maquinas.repository.interface';

@Injectable()
export class DeleteMaquinaUseCase {
  constructor(
    @Inject(MAQUINAS_REPOSITORY_TOKEN) private readonly maquinasRepository: IMaquinasRepository,
  ) {}

  async execute(id: number): Promise<{ message: string; id: number; codigo: string }> {
    // Verificar se a máquina existe
    const maquina = await this.maquinasRepository.findOne(id);
    if (!maquina) {
      throw new Error('Máquina não encontrada');
    }

    // Verificar se a máquina pode ser removida
    if (maquina.status === StatusMaquina.EM_USO) {
      throw new Error('Não é possível remover uma máquina em uso');
    }

    // Soft delete
    await this.maquinasRepository.remove(id);

    return {
      message: 'Máquina removida com sucesso',
      id: maquina.id,
      codigo: maquina.codigo,
    };
  }
}
