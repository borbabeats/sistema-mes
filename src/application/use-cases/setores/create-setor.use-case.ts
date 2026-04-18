import { Injectable, Inject } from '@nestjs/common';
import {
  ISetoresRepository,
  CreateSetorData,
} from '../../../domain/repositories/setores.repository.interface';
import { Setor } from '../../../domain/entities/setor.entity';
import { SETORES_REPOSITORY_TOKEN } from '../../../modules/setores/constants';

@Injectable()
export class CreateSetorUseCase {
  constructor(
    @Inject(SETORES_REPOSITORY_TOKEN)
    private readonly setoresRepository: ISetoresRepository,
  ) {}

  async execute(data: CreateSetorData): Promise<Setor> {
    // Verificar se o nome já existe
    const existingSetor = await this.setoresRepository.findByNome(data.nome);
    if (existingSetor) {
      throw new Error('Já existe um setor com este nome');
    }

    return this.setoresRepository.create(data);
  }
}
