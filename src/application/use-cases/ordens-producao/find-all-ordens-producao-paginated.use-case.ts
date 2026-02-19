import { Injectable, Inject } from '@nestjs/common';
import { IOrdensProducaoRepository, OrdemProducaoFilters } from '../../../domain/repositories/ordens-producao.repository.interface';
import { OrdemProducao } from '../../../domain/entities/ordem-producao.entity';
import { ORDENS_PRODUCAO_REPOSITORY_TOKEN } from '../../../modules/ordens-producao/constants';
import { FindAllOrdensProducaoDto } from '../../../presentation/dto/ordens-producao/find-all-ordens-producao.dto';
import { PaginatedResult } from '../../../presentation/dto/common/pagination.dto';

@Injectable()
export class FindAllOrdensProducaoPaginatedUseCase {
  constructor(
    @Inject(ORDENS_PRODUCAO_REPOSITORY_TOKEN)
    private readonly ordensProducaoRepository: IOrdensProducaoRepository,
  ) {}

  async execute(filters?: FindAllOrdensProducaoDto): Promise<PaginatedResult<OrdemProducao>> {
    const repositoryFilters: OrdemProducaoFilters = {
      codigo: filters?.codigo,
      produto: filters?.produto,
      status: filters?.status,
      prioridade: filters?.prioridade,
      origemTipo: filters?.origemTipo,
      setorId: filters?.setorId,
      responsavelId: filters?.responsavelId,
      dataInicio: filters?.dataInicio ? new Date(filters.dataInicio) : undefined,
      dataFim: filters?.dataFim ? new Date(filters.dataFim) : undefined,
      search: filters?.search || filters?.filter,
      searchField: filters?.searchField,
      sortBy: filters?.sortBy,
      sortOrder: filters?.sortOrder || 'DESC',
    };

    const page = filters?.page || 1;
    const limit = filters?.limit || 20;

    return this.ordensProducaoRepository.findAllPaginated(repositoryFilters, page, limit);
  }
}
