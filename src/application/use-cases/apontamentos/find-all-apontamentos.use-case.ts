import { Injectable, Inject } from '@nestjs/common';
import { IApontamentosRepository, ApontamentoFilters, APONTAMENTOS_REPOSITORY_TOKEN } from '../../../domain/repositories/apontamentos.repository.interface';
import { Apontamento } from '../../../domain/entities/apontamento.entity';

@Injectable()
export class FindAllApontamentosUseCase {
  constructor(
    @Inject(APONTAMENTOS_REPOSITORY_TOKEN) private readonly apontamentosRepository: IApontamentosRepository,
  ) {}

  async execute(filters?: ApontamentoFilters): Promise<Apontamento[]> {
    return this.apontamentosRepository.findAll(filters);
  }
}
