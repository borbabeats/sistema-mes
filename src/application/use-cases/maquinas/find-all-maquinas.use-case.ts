import { Injectable, Inject } from '@nestjs/common';
import { IMaquinasRepository, MaquinaFilters } from '../../../domain/repositories/maquinas.repository.interface';
import { Maquina } from '../../../domain/entities/maquina.entity';
import { MAQUINAS_REPOSITORY_TOKEN } from '../../../domain/repositories/maquinas.repository.interface';

@Injectable()
export class FindAllMaquinasUseCase {
  constructor(
    @Inject(MAQUINAS_REPOSITORY_TOKEN) private readonly maquinasRepository: IMaquinasRepository,
  ) {}

  async execute(filters?: MaquinaFilters): Promise<Maquina[]> {
    return this.maquinasRepository.findAll(filters);
  }
}
