import { Injectable, Inject } from '@nestjs/common';
import { IOrdensProducaoRepository } from '../../../domain/repositories/ordens-producao.repository.interface';
import {
  OrdemProducao,
  StatusOP,
} from '../../../domain/entities/ordem-producao.entity';
import { ORDENS_PRODUCAO_REPOSITORY_TOKEN } from '../../../modules/ordens-producao/constants';

@Injectable()
export class FindByStatusUseCase {
  constructor(
    @Inject(ORDENS_PRODUCAO_REPOSITORY_TOKEN)
    private readonly ordensProducaoRepository: IOrdensProducaoRepository,
  ) {}

  async execute(status: StatusOP): Promise<OrdemProducao[]> {
    // Validar status
    if (!Object.values(StatusOP).includes(status)) {
      throw new Error('Status inválido');
    }

    return this.ordensProducaoRepository.findByStatus(status);
  }
}
