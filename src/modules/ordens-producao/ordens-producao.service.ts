import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IOrdensProducaoRepository } from '../../domain/repositories/ordens-producao.repository.interface';
import { OrdemProducao, StatusOP, PrioridadeOP } from '../../domain/entities/ordem-producao.entity';
import { CreateOrdemProducaoData } from '../../domain/repositories/ordens-producao.repository.interface';
import { ORDENS_PRODUCAO_REPOSITORY_TOKEN } from './constants';
import { CreateOrdemProducaoDto } from '../../presentation/dto/ordens-producao/create-ordem-producao.dto';
import { CreateOrdemProducaoUseCase } from '../../application/use-cases/ordens-producao/create-ordem-producao.use-case';
import { FindOrdemProducaoUseCase } from '../../application/use-cases/ordens-producao/find-ordem-producao.use-case';
import { FindAllOrdensProducaoUseCase } from '../../application/use-cases/ordens-producao/find-all-ordens-producao.use-case';
import { UpdateOrdemProducaoUseCase } from '../../application/use-cases/ordens-producao/update-ordem-producao.use-case';
import { DeleteOrdemProducaoUseCase } from '../../application/use-cases/ordens-producao/delete-ordem-producao.use-case';
import { IniciarProducaoUseCase } from '../../application/use-cases/ordens-producao/iniciar-producao.use-case';
import { PausarProducaoUseCase } from '../../application/use-cases/ordens-producao/pausar-producao.use-case';
import { RetomarProducaoUseCase } from '../../application/use-cases/ordens-producao/retomar-producao.use-case';
import { FinalizarProducaoUseCase } from '../../application/use-cases/ordens-producao/finalizar-producao.use-case';
import { CancelarProducaoUseCase } from '../../application/use-cases/ordens-producao/cancelar-producao.use-case';
import { UpdateQuantidadeProduzidaUseCase } from '../../application/use-cases/ordens-producao/update-quantidade-produzida.use-case';
import { FindByCodigoUseCase } from '../../application/use-cases/ordens-producao/find-by-codigo.use-case';
import { FindByStatusUseCase } from '../../application/use-cases/ordens-producao/find-by-status.use-case';
import { FindByPrioridadeUseCase } from '../../application/use-cases/ordens-producao/find-by-prioridade.use-case';
import { FindBySetorUseCase } from '../../application/use-cases/ordens-producao/find-by-setor.use-case';
import { FindByResponsavelUseCase } from '../../application/use-cases/ordens-producao/find-by-responsavel.use-case';
import { FindOverdueUseCase } from '../../application/use-cases/ordens-producao/find-overdue.use-case';
import { FindPendingUseCase } from '../../application/use-cases/ordens-producao/find-pending.use-case';

@Injectable()
export class OrdensProducaoService {
  constructor(
    private readonly createOrdemProducaoUseCase: CreateOrdemProducaoUseCase,
    private readonly findOrdemProducaoUseCase: FindOrdemProducaoUseCase,
    private readonly findAllOrdensProducaoUseCase: FindAllOrdensProducaoUseCase,
    private readonly updateOrdemProducaoUseCase: UpdateOrdemProducaoUseCase,
    private readonly deleteOrdemProducaoUseCase: DeleteOrdemProducaoUseCase,
    private readonly iniciarProducaoUseCase: IniciarProducaoUseCase,
    private readonly pausarProducaoUseCase: PausarProducaoUseCase,
    private readonly retomarProducaoUseCase: RetomarProducaoUseCase,
    private readonly finalizarProducaoUseCase: FinalizarProducaoUseCase,
    private readonly cancelarProducaoUseCase: CancelarProducaoUseCase,
    private readonly updateQuantidadeProduzidaUseCase: UpdateQuantidadeProduzidaUseCase,
    private readonly findByCodigoUseCase: FindByCodigoUseCase,
    private readonly findByStatusUseCase: FindByStatusUseCase,
    private readonly findByPrioridadeUseCase: FindByPrioridadeUseCase,
    private readonly findBySetorUseCase: FindBySetorUseCase,
    private readonly findByResponsavelUseCase: FindByResponsavelUseCase,
    private readonly findOverdueUseCase: FindOverdueUseCase,
    private readonly findPendingUseCase: FindPendingUseCase,
  ) {}

  async create(createOrdemProducaoDto: CreateOrdemProducaoDto): Promise<OrdemProducao> {
    const { prioridade, ...rest } = createOrdemProducaoDto;
    
    const createData: CreateOrdemProducaoData = {
      ...rest,
      prioridade: prioridade as PrioridadeOP,
    };
    
    return this.createOrdemProducaoUseCase.execute(createData);
  }

  async findAll(filters?: any): Promise<OrdemProducao[]> {
    return this.findAllOrdensProducaoUseCase.execute(filters);
  }

  async findOne(id: number): Promise<OrdemProducao> {
    const ordemProducao = await this.findOrdemProducaoUseCase.execute(id);
    
    if (!ordemProducao) {
      throw new NotFoundException(`Ordem de produção com ID ${id} não encontrada`);
    }

    return ordemProducao;
  }

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

  async update(id: number, updateOrdemProducaoDto: any): Promise<OrdemProducao> {
    return this.updateOrdemProducaoUseCase.execute(id, updateOrdemProducaoDto);
  }

  async remove(id: number): Promise<{ message: string; id: number; codigo: string }> {
    return this.deleteOrdemProducaoUseCase.execute(id);
  }

  async iniciarProducao(id: number): Promise<OrdemProducao> {
    return this.iniciarProducaoUseCase.execute(id);
  }

  async pausarProducao(id: number): Promise<OrdemProducao> {
    return this.pausarProducaoUseCase.execute(id);
  }

  async retomarProducao(id: number): Promise<OrdemProducao> {
    return this.retomarProducaoUseCase.execute(id);
  }

  async finalizarProducao(id: number): Promise<OrdemProducao> {
    return this.finalizarProducaoUseCase.execute(id);
  }

  async cancelarProducao(id: number, motivo: string): Promise<OrdemProducao> {
    return this.cancelarProducaoUseCase.execute(id, motivo);
  }

  async atualizarProducao(id: number, quantidade: number, defeitos: number): Promise<OrdemProducao> {
    return this.updateQuantidadeProduzida(id, quantidade);
  }

  async updateQuantidadeProduzida(id: number, quantidade: number): Promise<OrdemProducao> {
    return this.updateQuantidadeProduzidaUseCase.execute(id, quantidade);
  }
}
