import { Injectable, Inject } from '@nestjs/common';
import { IMaquinasRepository } from '../../../domain/repositories/maquinas.repository.interface';
import { Maquina, StatusMaquina } from '../../../domain/entities/maquina.entity';
import { MAQUINAS_REPOSITORY_TOKEN } from '../../../domain/repositories/maquinas.repository.interface';

@Injectable()
export class FindByStatusUseCase {
  constructor(
    @Inject(MAQUINAS_REPOSITORY_TOKEN) private readonly maquinasRepository: IMaquinasRepository,
  ) {}

  async execute(status: StatusMaquina): Promise<Maquina[]> {
    // Validar status
    if (!Object.values(StatusMaquina).includes(status)) {
      throw new Error('Status inválido');
    }

    return this.maquinasRepository.findByStatus(status);
  }
}
