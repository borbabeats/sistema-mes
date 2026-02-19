import { OrdemProducao, StatusOP, PrioridadeOP, OrigemOP } from '../entities/ordem-producao.entity';
import { PaginatedResult } from '../../presentation/dto/common/pagination.dto';

export interface IOrdensProducaoRepository {
  create(data: CreateOrdemProducaoData): Promise<OrdemProducao>;
  findAll(filters?: OrdemProducaoFilters): Promise<OrdemProducao[]>;
  findAllPaginated(filters?: OrdemProducaoFilters, page?: number, limit?: number): Promise<PaginatedResult<OrdemProducao>>;
  findOne(id: number): Promise<OrdemProducao | null>;
  findByCodigo(codigo: string): Promise<OrdemProducao | null>;
  findByStatus(status: StatusOP): Promise<OrdemProducao[]>;
  findByPrioridade(prioridade: PrioridadeOP): Promise<OrdemProducao[]>;
  findBySetor(setorId: number): Promise<OrdemProducao[]>;
  findByResponsavel(responsavelId: number): Promise<OrdemProducao[]>;
  findOverdue(): Promise<OrdemProducao[]>;
  findPending(): Promise<OrdemProducao[]>;
  update(id: number, data: UpdateOrdemProducaoData): Promise<OrdemProducao>;
  remove(id: number): Promise<OrdemProducao>;
  updateQuantidadeProduzida(id: number, quantidade: number): Promise<OrdemProducao>;
}

export interface CreateOrdemProducaoData {
  codigo: string;
  produto: string;
  descricao?: string | null;
  quantidadePlanejada: number;
  prioridade?: PrioridadeOP;
  dataInicioPlanejado?: string | null;
  dataFimPlanejado?: string | null;
  setorId: number;
  responsavelId?: number | null;
  origemTipo?: OrigemOP | null;
  origemId?: string | null;
  observacoes?: string | null;
}

export interface UpdateOrdemProducaoData {
  codigo?: string;
  produto?: string;
  descricao?: string | null;
  quantidadePlanejada?: number;
  quantidadeProduzida?: number;
  status?: StatusOP;
  prioridade?: PrioridadeOP;
  dataFimReal?: Date | null;
  dataInicioReal?: Date | null;
  dataInicioPlanejado?: Date | null;
  dataFimPlanejado?: Date | null;
  setorId?: number;
  responsavelId?: number | null;
  origemTipo?: OrigemOP | null;
  origemId?: string | null;
  observacoes?: string | null;
}

export interface OrdemProducaoFilters {
  codigo?: string;
  produto?: string;
  status?: StatusOP;
  prioridade?: PrioridadeOP;
  origemTipo?: OrigemOP;
  setorId?: number;
  responsavelId?: number;
  dataInicio?: Date;
  dataFim?: Date;
  search?: string;
  searchField?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
