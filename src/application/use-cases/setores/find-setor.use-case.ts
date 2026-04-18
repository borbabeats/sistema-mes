import { Injectable, Inject } from '@nestjs/common';
import { ISetoresRepository } from '../../../domain/repositories/setores.repository.interface';
import { Setor } from '../../../domain/entities/setor.entity';
import { SETORES_REPOSITORY_TOKEN } from '../../../modules/setores/constants';

@Injectable()
export class FindSetorUseCase {
  constructor(
    @Inject(SETORES_REPOSITORY_TOKEN)
    private readonly setoresRepository: ISetoresRepository,
  ) {}

  async execute(id: number): Promise<Setor | null> {
    return this.setoresRepository.findOne(id);
  }
}
