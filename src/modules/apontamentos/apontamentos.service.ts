import { Injectable, NotFoundException } from '@nestjs/common';
import { Apontamento } from '../../domain/entities/apontamento.entity';
import { CreateApontamentoUseCase } from '../../application/use-cases/apontamentos/create-apontamento.use-case';
import { FinalizeApontamentoUseCase } from '../../application/use-cases/apontamentos/finalize-apontamento.use-case';
import { FindApontamentoUseCase } from '../../application/use-cases/apontamentos/find-apontamento.use-case';
import { FindAllApontamentosUseCase } from '../../application/use-cases/apontamentos/find-all-apontamentos.use-case';
import { UpdateApontamentoUseCase } from '../../application/use-cases/apontamentos/update-apontamento.use-case';
import { DeleteApontamentoUseCase } from '../../application/use-cases/apontamentos/delete-apontamento.use-case';
import { FindByMaquinaUseCase } from '../../application/use-cases/apontamentos/find-by-maquina.use-case';
import { FindByUsuarioUseCase } from '../../application/use-cases/apontamentos/find-by-usuario.use-case';
import { FindByOrdemProducaoUseCase } from '../../application/use-cases/apontamentos/find-by-ordem-producao.use-case';
import { FindByPeriodoUseCase } from '../../application/use-cases/apontamentos/find-by-periodo.use-case';
import { CreateApontamentoData } from '../../domain/repositories/apontamentos.repository.interface';

@Injectable()
export class ApontamentosService {
  constructor(
    private readonly createApontamentoUseCase: CreateApontamentoUseCase,
    private readonly finalizeApontamentoUseCase: FinalizeApontamentoUseCase,
    private readonly findApontamentoUseCase: FindApontamentoUseCase,
    private readonly findAllApontamentosUseCase: FindAllApontamentosUseCase,
    private readonly updateApontamentoUseCase: UpdateApontamentoUseCase,
    private readonly deleteApontamentoUseCase: DeleteApontamentoUseCase,
    private readonly findByMaquinaUseCase: FindByMaquinaUseCase,
    private readonly findByUsuarioUseCase: FindByUsuarioUseCase,
    private readonly findByOrdemProducaoUseCase: FindByOrdemProducaoUseCase,
    private readonly findByPeriodoUseCase: FindByPeriodoUseCase,
  ) {}

  async create(createApontamentoDto: CreateApontamentoData): Promise<Apontamento> {
    return this.createApontamentoUseCase.execute(createApontamentoDto);
  }

  async findAll(filters?: any): Promise<Apontamento[]> {
    return this.findAllApontamentosUseCase.execute(filters);
  }

  async findOne(id: number): Promise<Apontamento> {
    const apontamento = await this.findApontamentoUseCase.execute(id);
    
    if (!apontamento) {
      throw new NotFoundException(`Apontamento com ID ${id} não encontrado`);
    }

    return apontamento;
  }

  async findByMaquina(maquinaId: number): Promise<Apontamento[]> {
    return this.findByMaquinaUseCase.execute(maquinaId);
  }

  async findByUsuario(usuarioId: number): Promise<Apontamento[]> {
    return this.findByUsuarioUseCase.execute(usuarioId);
  }

  async findByOrdemProducao(opId: number): Promise<Apontamento[]> {
    return this.findByOrdemProducaoUseCase.execute(opId);
  }

  async findByPeriodo(dataInicio: Date, dataFim: Date): Promise<Apontamento[]> {
    return this.findByPeriodoUseCase.execute(dataInicio, dataFim);
  }

  async update(id: number, updateApontamentoDto: any): Promise<Apontamento> {
    return this.updateApontamentoUseCase.execute(id, updateApontamentoDto);
  }

  async remove(id: number): Promise<{ message: string; id: number }> {
    return this.deleteApontamentoUseCase.execute(id);
  }

  async finalizeApontamento(id: number, quantidadeProduzida?: number, quantidadeDefeito?: number): Promise<Apontamento> {
    return this.finalizeApontamentoUseCase.execute(id, quantidadeProduzida, quantidadeDefeito);
  }
}
