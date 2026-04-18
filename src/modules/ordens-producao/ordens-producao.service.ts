import { Injectable, NotFoundException } from '@nestjs/common';
import {
  OrdemProducao,
  StatusOP,
  PrioridadeOP,
} from '../../domain/entities/ordem-producao.entity';
import { CreateOrdemProducaoData } from '../../domain/repositories/ordens-producao.repository.interface';
import { CreateOrdemProducaoDto } from '../../presentation/dto/ordens-producao/create-ordem-producao.dto';
import { ChangeStatusOrdemProducaoDto } from '../../presentation/dto/ordens-producao/change-status-ordem-producao.dto';
import { CreateOrdemProducaoUseCase } from '../../application/use-cases/ordens-producao/create-ordem-producao.use-case';
import { FindOrdemProducaoUseCase } from '../../application/use-cases/ordens-producao/find-ordem-producao.use-case';
import { FindAllOrdensProducaoUseCase } from '../../application/use-cases/ordens-producao/find-all-ordens-producao.use-case';
import { FindAllOrdensProducaoPaginatedUseCase } from '../../application/use-cases/ordens-producao/find-all-ordens-producao-paginated.use-case';
import { UpdateOrdemProducaoUseCase } from '../../application/use-cases/ordens-producao/update-ordem-producao.use-case';
import { DeleteOrdemProducaoUseCase } from '../../application/use-cases/ordens-producao/delete-ordem-producao.use-case';
import { UpdateQuantidadeProduzidaUseCase } from '../../application/use-cases/ordens-producao/update-quantidade-produzida.use-case';
import { FindByCodigoUseCase } from '../../application/use-cases/ordens-producao/find-by-codigo.use-case';
import { FindByStatusUseCase } from '../../application/use-cases/ordens-producao/find-by-status.use-case';
import { FindByPrioridadeUseCase } from '../../application/use-cases/ordens-producao/find-by-prioridade.use-case';
import { FindBySetorUseCase } from '../../application/use-cases/ordens-producao/find-by-setor.use-case';
import { FindByResponsavelUseCase } from '../../application/use-cases/ordens-producao/find-by-responsavel.use-case';
import { FindOverdueUseCase } from '../../application/use-cases/ordens-producao/find-overdue.use-case';
import { FindPendingUseCase } from '../../application/use-cases/ordens-producao/find-pending.use-case';
import { ChangeStatusOrdemProducaoUseCase } from '../../application/use-cases/ordens-producao/change-status-ordem-producao.use-case';
import { FindAllOrdensProducaoDto } from '../../presentation/dto/ordens-producao/find-all-ordens-producao.dto';
import { PaginatedResult } from '../../presentation/dto/common/pagination.dto';

@Injectable()
export class OrdensProducaoService {
  constructor(
    private readonly createOrdemProducaoUseCase: CreateOrdemProducaoUseCase,
    private readonly findOrdemProducaoUseCase: FindOrdemProducaoUseCase,
    private readonly findAllOrdensProducaoUseCase: FindAllOrdensProducaoUseCase,
    private readonly findAllOrdensProducaoPaginatedUseCase: FindAllOrdensProducaoPaginatedUseCase,
    private readonly updateOrdemProducaoUseCase: UpdateOrdemProducaoUseCase,
    private readonly deleteOrdemProducaoUseCase: DeleteOrdemProducaoUseCase,
    private readonly updateQuantidadeProduzidaUseCase: UpdateQuantidadeProduzidaUseCase,
    private readonly findByCodigoUseCase: FindByCodigoUseCase,
    private readonly findByStatusUseCase: FindByStatusUseCase,
    private readonly findByPrioridadeUseCase: FindByPrioridadeUseCase,
    private readonly findBySetorUseCase: FindBySetorUseCase,
    private readonly findByResponsavelUseCase: FindByResponsavelUseCase,
    private readonly findOverdueUseCase: FindOverdueUseCase,
    private readonly findPendingUseCase: FindPendingUseCase,
    private readonly changeStatusOrdemProducaoUseCase: ChangeStatusOrdemProducaoUseCase,
  ) {}

  async create(
    createOrdemProducaoDto: CreateOrdemProducaoDto,
  ): Promise<OrdemProducao> {
    const { prioridade, ...rest } = createOrdemProducaoDto;

    const createData: CreateOrdemProducaoData = {
      ...rest,
      prioridade: prioridade as PrioridadeOP,
    };

    return this.createOrdemProducaoUseCase.execute(createData);
  }

  async findAll(): Promise<OrdemProducao[]> {
    return this.findAllOrdensProducaoUseCase.execute();
  }

  async findAllPaginated(
    filters: FindAllOrdensProducaoDto,
  ): Promise<PaginatedResult<OrdemProducao>> {
    return this.findAllOrdensProducaoPaginatedUseCase.execute(filters);
  }

  async findOne(id: number): Promise<OrdemProducao> {
    const ordem = await this.findOrdemProducaoUseCase.execute(id);
    if (!ordem) {
      throw new NotFoundException('Ordem de produção não encontrada');
    }
    return ordem;
  }

  async update(
    id: number,
    updateOrdemProducaoDto: any,
  ): Promise<OrdemProducao> {
    return this.updateOrdemProducaoUseCase.execute(id, updateOrdemProducaoDto);
  }

  async remove(
    id: number,
  ): Promise<{ message: string; id: number; codigo: string }> {
    const ordem = await this.findOrdemProducaoUseCase.execute(id);
    if (!ordem) {
      throw new NotFoundException('Ordem de produção não encontrada');
    }

    await this.deleteOrdemProducaoUseCase.execute(id);

    return {
      message: 'Ordem de produção removida com sucesso',
      id: ordem.id,
      codigo: ordem.codigo,
    };
  }

  async changeStatus(
    id: number,
    dto: ChangeStatusOrdemProducaoDto,
    userRoles: string[] = [],
    userId?: number,
  ): Promise<OrdemProducao> {
    return this.changeStatusOrdemProducaoUseCase.execute(
      id,
      dto,
      userRoles,
      userId,
    );
  }

  async atualizarProducao(
    id: number,
    quantidade: number,
  ): Promise<OrdemProducao> {
    return this.updateQuantidadeProduzida(id, quantidade);
  }

  async updateQuantidadeProduzida(
    id: number,
    quantidade: number,
  ): Promise<OrdemProducao> {
    return this.updateQuantidadeProduzidaUseCase.execute(id, quantidade);
  }

  // Métodos de busca especializados
  async findByCodigo(codigo: string): Promise<OrdemProducao | null> {
    return this.findByCodigoUseCase.execute(codigo);
  }

  async findByStatus(status: StatusOP): Promise<OrdemProducao[]> {
    return this.findByStatusUseCase.execute(status);
  }

  async findByPrioridade(prioridade: PrioridadeOP): Promise<OrdemProducao[]> {
    return this.findByPrioridadeUseCase.execute(prioridade);
  }

  async findBySetor(setorId: number): Promise<OrdemProducao[]> {
    return this.findBySetorUseCase.execute(setorId);
  }

  async findByResponsavel(responsavelId: number): Promise<OrdemProducao[]> {
    return this.findByResponsavelUseCase.execute(responsavelId);
  }

  async findOverdue(): Promise<OrdemProducao[]> {
    return this.findOverdueUseCase.execute();
  }

  async findPending(): Promise<OrdemProducao[]> {
    return this.findPendingUseCase.execute();
  }
}
