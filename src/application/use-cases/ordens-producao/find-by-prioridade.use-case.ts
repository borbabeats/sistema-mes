import { Injectable, Inject } from '@nestjs/common';
import { IOrdensProducaoRepository } from '../../../domain/repositories/ordens-producao.repository.interface';
import { OrdemProducao, PrioridadeOP } from '../../../domain/entities/ordem-producao.entity';
import { ORDENS_PRODUCAO_REPOSITORY_TOKEN } from '../../../modules/ordens-producao/constants';

@Injectable()
export class FindByPrioridadeUseCase {
  constructor(
    @Inject(ORDENS_PRODUCAO_REPOSITORY_TOKEN) private readonly ordensProducaoRepository: IOrdensProducaoRepository,
  ) {}

  async execute(prioridade: PrioridadeOP): Promise<OrdemProducao[]> {
    // Validar prioridade
    if (!Object.values(PrioridadeOP).includes(prioridade)) {
      throw new Error('Prioridade inválida');
    }

    return this.ordensProducaoRepository.findByPrioridade(prioridade);
  }
}
