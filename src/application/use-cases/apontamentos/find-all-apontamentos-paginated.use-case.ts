import { Injectable, Inject } from '@nestjs/common';
import { IApontamentosRepository, ApontamentoFilters, APONTAMENTOS_REPOSITORY_TOKEN } from '../../../domain/repositories/apontamentos.repository.interface';
import { Apontamento } from '../../../domain/entities/apontamento.entity';
import { FindAllApontamentosDto } from '../../../presentation/dto/apontamentos/find-all-apontamentos.dto';
import { PaginatedResult } from '../../../presentation/dto/common/pagination.dto';

@Injectable()
export class FindAllApontamentosPaginatedUseCase {
  constructor(
    @Inject(APONTAMENTOS_REPOSITORY_TOKEN) private readonly apontamentosRepository: IApontamentosRepository,
  ) {}

  async execute(filters?: FindAllApontamentosDto): Promise<PaginatedResult<Apontamento>> {
    const repositoryFilters: ApontamentoFilters = {
      opId: filters?.opId,
      maquinaId: filters?.maquinaId,
      usuarioId: filters?.usuarioId,
      dataInicio: filters?.dataInicio,
      dataFim: filters?.dataFim,
      status: filters?.status,
      setorId: filters?.setorId,
      ativo: filters?.ativo,
      search: filters?.search,
      searchField: filters?.searchField,
    };
    
    // Padrão Refine: _start e _end
    const start = filters?._start || 0;
    const end = filters?._end || 10;
    const limit = end - start + 1;
    const page = Math.floor(start / limit) + 1;
    
    return this.apontamentosRepository.findAllPaginated(repositoryFilters, page, limit);
  }
}
