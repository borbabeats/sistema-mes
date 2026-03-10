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
      search: filters?.search || filters?.filter, // Usa filter ou search
      searchField: filters?.searchField,
      sortBy: filters?.sortBy,
      sortOrder: filters?.sortOrder || 'DESC',
    };
    
    // Padrão RESTful: ?page=1&limit=20
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    
    return this.apontamentosRepository.findAllPaginated(repositoryFilters, page, limit);
  }
}
