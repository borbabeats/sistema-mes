import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IApontamentosRepository, APONTAMENTOS_REPOSITORY_TOKEN } from '../domain/repositories/apontamentos.repository.interface';
import { CreateApontamentoUseCase } from '../application/use-cases/apontamentos/create-apontamento.use-case';
import { FinalizeApontamentoUseCase } from '../application/use-cases/apontamentos/finalize-apontamento.use-case';
import { Apontamento } from '../domain/entities/apontamento.entity';
import { CreateApontamentoData } from '../domain/repositories/apontamentos.repository.interface';

@Injectable()
export class ApontamentosService {
  constructor(
    @Inject(APONTAMENTOS_REPOSITORY_TOKEN) private readonly repository: IApontamentosRepository,
    private readonly createApontamentoUseCase: CreateApontamentoUseCase,
    private readonly finalizeApontamentoUseCase: FinalizeApontamentoUseCase,
  ) {}

  async create(createApontamentoDto: CreateApontamentoData): Promise<Apontamento> {
    return this.createApontamentoUseCase.execute(createApontamentoDto);
  }

  async findAll(filters?: any): Promise<Apontamento[]> {
    return this.repository.findAll(filters);
  }

  async findOne(id: number): Promise<Apontamento> {
    const apontamento = await this.repository.findOne(id);
    
    if (!apontamento) {
      throw new NotFoundException(`Apontamento com ID ${id} não encontrado`);
    }

    return apontamento;
  }

  async findByMaquina(maquinaId: number): Promise<Apontamento[]> {
    return this.repository.findByMaquina(maquinaId);
  }

  async findByUsuario(usuarioId: number): Promise<Apontamento[]> {
    return this.repository.findByUsuario(usuarioId);
  }

  async findByOrdemProducao(opId: number): Promise<Apontamento[]> {
    return this.repository.findByOrdemProducao(opId);
  }

  async findByPeriodo(dataInicio: Date, dataFim: Date): Promise<Apontamento[]> {
    return this.repository.findByPeriodo(dataInicio, dataFim);
  }

  async update(id: number, updateApontamentoDto: any): Promise<Apontamento> {
    await this.findOne(id);
    return this.repository.update(id, updateApontamentoDto);
  }

  async remove(id: number): Promise<Apontamento> {
    await this.findOne(id);
    return this.repository.remove(id);
  }

  async finalizeApontamento(id: number, quantidadeProduzida?: number, quantidadeDefeito?: number): Promise<Apontamento> {
    return this.finalizeApontamentoUseCase.execute(id, quantidadeProduzida, quantidadeDefeito);
  }
}
