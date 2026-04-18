import { Injectable, Inject } from '@nestjs/common';
import {
  IApontamentosRepository,
  ApontamentoFilters,
  APONTAMENTOS_REPOSITORY_TOKEN,
} from '../../../domain/repositories/apontamentos.repository.interface';
import { Apontamento } from '../../../domain/entities/apontamento.entity';
import { FilterApontamentosDto } from '../../../presentation/dto/apontamentos/filter-apontamentos.dto';

@Injectable()
export class FindAllApontamentosUseCase {
  constructor(
    @Inject(APONTAMENTOS_REPOSITORY_TOKEN)
    private readonly apontamentosRepository: IApontamentosRepository,
  ) {}

  async execute(filters?: FilterApontamentosDto): Promise<Apontamento[]> {
    const repositoryFilters: ApontamentoFilters = {
      opId: filters?.opId,
      maquinaId: filters?.maquinaId,
      usuarioId: filters?.usuarioId,
      dataInicio: filters?.dataInicio,
      dataFim: filters?.dataFim,
      status: filters?.status,
      setorId: filters?.setorId,
      ativo: filters?.ativo,
    };

    return this.apontamentosRepository.findAll(repositoryFilters);
  }
}
