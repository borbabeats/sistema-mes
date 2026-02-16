import { Apontamento } from '../entities/apontamento.entity';
import { PaginatedResult } from '../../presentation/dto/common/pagination.dto';

export const APONTAMENTOS_REPOSITORY_TOKEN = 'APONTAMENTOS_REPOSITORY';

export interface IApontamentosRepository {
  create(data: CreateApontamentoData): Promise<Apontamento>;
  findAll(filters?: ApontamentoFilters): Promise<Apontamento[]>;
  findAllPaginated(filters?: ApontamentoFilters, page?: number, limit?: number): Promise<PaginatedResult<Apontamento>>;
  findOne(id: number): Promise<Apontamento | null>;
  findByMaquina(maquinaId: number): Promise<Apontamento[]>;
  findByUsuario(usuarioId: number): Promise<Apontamento[]>;
  findByOrdemProducao(opId: number): Promise<Apontamento[]>;
  findByPeriodo(dataInicio: Date, dataFim: Date): Promise<Apontamento[]>;
  update(id: number, data: UpdateApontamentoData): Promise<Apontamento>;
  remove(id: number): Promise<Apontamento>;
}

export interface CreateApontamentoData {
  opId: number;
  maquinaId: number;
  usuarioId: number;
  quantidadeProduzida?: number;
  quantidadeDefeito?: number;
  dataInicio: string;
  dataFim?: string | null;
}

export interface CreateApontamentoInternalData {
  opId: number;
  maquinaId: number;
  usuarioId: number;
  quantidadeProduzida?: number;
  quantidadeDefeito?: number;
  dataInicio: Date;
  dataFim?: Date | null;
}

export interface UpdateApontamentoData {
  opId?: number;
  maquinaId?: number;
  usuarioId?: number;
  quantidadeProduzida?: number;
  quantidadeDefeito?: number;
  dataInicio?: string;
  dataFim?: string | null;
}

export interface ApontamentoFilters {
  opId?: number;
  maquinaId?: number;
  usuarioId?: number;
  dataInicio?: Date;
  dataFim?: Date;
  status?: string;
  setorId?: number;
  ativo?: boolean;
  search?: string;
  searchField?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
