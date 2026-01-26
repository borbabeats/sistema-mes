import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IOrdensProducaoRepository } from '../domain/repositories/ordens-producao.repository.interface';
import { CreateOrdemProducaoUseCase } from '../application/use-cases/ordens-producao/create-ordem-producao.use-case';
import { OrdemProducao, StatusOP, PrioridadeOP } from '../domain/entities/ordem-producao.entity';
import { CreateOrdemProducaoData } from '../domain/repositories/ordens-producao.repository.interface';
import { ORDENS_PRODUCAO_REPOSITORY_TOKEN } from './constants';
import { CreateOrdemProducaoDto } from '../presentation/dto/ordens-producao/create-ordem-producao.dto';

@Injectable()
export class OrdensProducaoService {
  constructor(
    @Inject(ORDENS_PRODUCAO_REPOSITORY_TOKEN) private readonly repository: IOrdensProducaoRepository,
    private readonly createOrdemProducaoUseCase: CreateOrdemProducaoUseCase,
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
    return this.repository.findAll(filters);
  }

  async findOne(id: number): Promise<OrdemProducao> {
    const ordemProducao = await this.repository.findOne(id);
    
    if (!ordemProducao) {
      throw new NotFoundException(`Ordem de produção com ID ${id} não encontrada`);
    }

    return ordemProducao;
  }

  async findByCodigo(codigo: string): Promise<OrdemProducao | null> {
    return this.repository.findByCodigo(codigo);
  }

  async findByStatus(status: any): Promise<OrdemProducao[]> {
    return this.repository.findByStatus(status);
  }

  async findByPrioridade(prioridade: any): Promise<OrdemProducao[]> {
    return this.repository.findByPrioridade(prioridade);
  }

  async findBySetor(setorId: number): Promise<OrdemProducao[]> {
    return this.repository.findBySetor(setorId);
  }

  async findByResponsavel(responsavelId: number): Promise<OrdemProducao[]> {
    return this.repository.findByResponsavel(responsavelId);
  }

  async findOverdue(): Promise<OrdemProducao[]> {
    return this.repository.findOverdue();
  }

  async findPending(): Promise<OrdemProducao[]> {
    return this.repository.findPending();
  }

  async update(id: number, updateOrdemProducaoDto: any): Promise<OrdemProducao> {
    await this.findOne(id);
    return this.repository.update(id, updateOrdemProducaoDto);
  }

  async remove(id: number): Promise<{ message: string; id: number; codigo: string }> {
    const ordem = await this.findOne(id);
    await this.repository.remove(id);
    return {
      message: 'Ordem de produção removida com sucesso',
      id: ordem.id,
      codigo: ordem.codigo
    };
  }

  async iniciarProducao(id: number): Promise<OrdemProducao> {
    const ordem = await this.findOne(id);
    return this.repository.update(id, { status: StatusOP.EM_ANDAMENTO });
  }

  async pausarProducao(id: number): Promise<OrdemProducao> {
    const ordem = await this.findOne(id);
    return this.repository.update(id, { status: StatusOP.PAUSADA });
  }

  async retomarProducao(id: number): Promise<OrdemProducao> {
    const ordem = await this.findOne(id);
    return this.repository.update(id, { status: StatusOP.EM_ANDAMENTO });
  }

  async finalizarProducao(id: number): Promise<OrdemProducao> {
    const ordem = await this.findOne(id);
    return this.repository.update(id, { status: StatusOP.FINALIZADA });
  }

  async cancelarProducao(id: number, motivo: string): Promise<OrdemProducao> {
    const ordem = await this.findOne(id);
    return this.repository.update(id, { status: StatusOP.CANCELADA });
  }

  async atualizarProducao(id: number, quantidade: number, defeitos: number): Promise<OrdemProducao> {
    return this.updateQuantidadeProduzida(id, quantidade);
  }

  async updateQuantidadeProduzida(id: number, quantidade: number): Promise<OrdemProducao> {
    await this.findOne(id);
    return this.repository.updateQuantidadeProduzida(id, quantidade);
  }
}
