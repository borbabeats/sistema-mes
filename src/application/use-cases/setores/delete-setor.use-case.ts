import { Injectable, Inject } from '@nestjs/common';
import { ISetoresRepository } from '../../../domain/repositories/setores.repository.interface';
import { Setor } from '../../../domain/entities/setor.entity';
import { SETORES_REPOSITORY_TOKEN } from '../../../modules/setores/constants';

@Injectable()
export class DeleteSetorUseCase {
  constructor(
    @Inject(SETORES_REPOSITORY_TOKEN) private readonly setoresRepository: ISetoresRepository,
  ) {}

  async execute(id: number): Promise<{ message: string; id: number; nome: string }> {
    // Verificar se o setor existe
    const setor = await this.setoresRepository.findOne(id);
    if (!setor) {
      throw new Error('Setor não encontrado');
    }

    // Verificar se há máquinas vinculadas ao setor
    // (Esta validação poderia ser implementada no repositório)
    // Por enquanto, vamos apenas fazer o soft delete

    // Soft delete
    await this.setoresRepository.remove(id);

    return {
      message: 'Setor removido com sucesso',
      id: setor.id,
      nome: setor.nome,
    };
  }
}
