import { Injectable, Inject } from '@nestjs/common';
import { IOrdensProducaoRepository, OrdemProducaoFilters } from '../../../domain/repositories/ordens-producao.repository.interface';
import { IApontamentosRepository, APONTAMENTOS_REPOSITORY_TOKEN } from '../../../domain/repositories/apontamentos.repository.interface';
import { OrdemProducao } from '../../../domain/entities/ordem-producao.entity';
import { ORDENS_PRODUCAO_REPOSITORY_TOKEN } from '../../../modules/ordens-producao/constants';

@Injectable()
export class FindAllOrdensProducaoUseCase {
  constructor(
    @Inject(ORDENS_PRODUCAO_REPOSITORY_TOKEN) private readonly ordensProducaoRepository: IOrdensProducaoRepository,
    @Inject(APONTAMENTOS_REPOSITORY_TOKEN) private readonly apontamentosRepository: IApontamentosRepository,
  ) {}

  async execute(filters?: OrdemProducaoFilters): Promise<OrdemProducao[]> {
    const ordensProducao = await this.ordensProducaoRepository.findAll(filters);
    
    // Adicionar contagem de apontamentos para cada OP
    for (const op of ordensProducao) {
      const apontamentos = await this.apontamentosRepository.findByOrdemProducao(op.id);
      (op as any).apontamentos = apontamentos.length;
    }
    
    return ordensProducao;
  }
}
