import { Injectable, Inject } from '@nestjs/common';
import { IOrdensProducaoRepository } from '../../../domain/repositories/ordens-producao.repository.interface';
import { OrdemProducao } from '../../../domain/entities/ordem-producao.entity';
import { ORDENS_PRODUCAO_REPOSITORY_TOKEN } from '../../../modules/ordens-producao/constants';

@Injectable()
export class FindByCodigoUseCase {
  constructor(
    @Inject(ORDENS_PRODUCAO_REPOSITORY_TOKEN)
    private readonly ordensProducaoRepository: IOrdensProducaoRepository,
  ) {}

  async execute(codigo: string): Promise<OrdemProducao | null> {
    return this.ordensProducaoRepository.findByCodigo(codigo);
  }
}
