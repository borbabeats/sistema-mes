import { Injectable, Inject } from '@nestjs/common';
import { IApontamentosRepository, APONTAMENTOS_REPOSITORY_TOKEN } from '../../../domain/repositories/apontamentos.repository.interface';
import { Apontamento } from '../../../domain/entities/apontamento.entity';

@Injectable()
export class FindByPeriodoUseCase {
  constructor(
    @Inject(APONTAMENTOS_REPOSITORY_TOKEN) private readonly apontamentosRepository: IApontamentosRepository,
  ) {}

  async execute(dataInicio: Date, dataFim: Date): Promise<Apontamento[]> {
    // Validar período
    if (dataInicio > dataFim) {
      throw new Error('Data de início não pode ser maior que a data de fim');
    }

    return this.apontamentosRepository.findByPeriodo(dataInicio, dataFim);
  }
}
