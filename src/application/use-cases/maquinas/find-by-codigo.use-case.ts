import { Injectable, Inject } from '@nestjs/common';
import { IMaquinasRepository } from '../../../domain/repositories/maquinas.repository.interface';
import { Maquina } from '../../../domain/entities/maquina.entity';
import { MAQUINAS_REPOSITORY_TOKEN } from '../../../domain/repositories/maquinas.repository.interface';

@Injectable()
export class FindByCodigoUseCase {
  constructor(
    @Inject(MAQUINAS_REPOSITORY_TOKEN)
    private readonly maquinasRepository: IMaquinasRepository,
  ) {}

  async execute(codigo: string): Promise<Maquina | null> {
    return this.maquinasRepository.findByCodigo(codigo);
  }
}
