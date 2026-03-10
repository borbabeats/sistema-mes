import { Injectable, Inject } from '@nestjs/common';
import { IMaquinasRepository } from '../../../domain/repositories/maquinas.repository.interface';
import { Maquina } from '../../../domain/entities/maquina.entity';
import { MAQUINAS_REPOSITORY_TOKEN } from '../../../domain/repositories/maquinas.repository.interface';
import { FindSetorUseCase } from '../setores/find-setor.use-case';

@Injectable()
export class FindBySetorUseCase {
  constructor(
    @Inject(MAQUINAS_REPOSITORY_TOKEN) private readonly maquinasRepository: IMaquinasRepository,
    private readonly findSetorUseCase: FindSetorUseCase,
  ) {}

  async execute(setorId: number): Promise<Maquina[]> {
    // Validar se o setor existe
    const setor = await this.findSetorUseCase.execute(setorId);
    if (!setor) {
      throw new Error('Setor não encontrado');
    }

    return this.maquinasRepository.findBySetor(setorId);
  }
}
