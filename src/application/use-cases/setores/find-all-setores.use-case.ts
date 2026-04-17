import { Injectable, Inject } from '@nestjs/common';
import { ISetoresRepository } from '../../../domain/repositories/setores.repository.interface';
import { Setor } from '../../../domain/entities/setor.entity';
import { SETORES_REPOSITORY_TOKEN } from '../../../modules/setores/constants';

@Injectable()
export class FindAllSetoresUseCase {
  constructor(
    @Inject(SETORES_REPOSITORY_TOKEN) private readonly setoresRepository: ISetoresRepository,
  ) {}

  async execute(filters?: any): Promise<Setor[]> {
    return this.setoresRepository.findAll(filters);
  }
}
