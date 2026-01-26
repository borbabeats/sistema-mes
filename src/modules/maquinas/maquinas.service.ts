import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IMaquinasRepository, MAQUINAS_REPOSITORY_TOKEN } from '../../domain/repositories/maquinas.repository.interface';
import { CreateMaquinaData } from '../../domain/repositories/maquinas.repository.interface';
import { Maquina } from '../../domain/entities/maquina.entity';
import { CreateMaquinaUseCase } from '../../application/use-cases/maquinas/create-maquina.use-case';
import { FindMaquinaUseCase } from '../../application/use-cases/maquinas/find-maquina.use-case';
import { FindAllMaquinasUseCase } from '../../application/use-cases/maquinas/find-all-maquinas.use-case';
import { UpdateMaquinaUseCase } from '../../application/use-cases/maquinas/update-maquina.use-case';
import { DeleteMaquinaUseCase } from '../../application/use-cases/maquinas/delete-maquina.use-case';
import { UpdateStatusMaquinaUseCase } from '../../application/use-cases/maquinas/update-status-maquina.use-case';
import { UpdateHorasUsoUseCase } from '../../application/use-cases/maquinas/update-horas-uso.use-case';
import { IniciarManutencaoUseCase } from '../../application/use-cases/maquinas/iniciar-manutencao.use-case';
import { FinalizarManutencaoUseCase } from '../../application/use-cases/maquinas/finalizar-manutencao.use-case';
import { FindByCodigoUseCase } from '../../application/use-cases/maquinas/find-by-codigo.use-case';
import { FindBySetorUseCase } from '../../application/use-cases/maquinas/find-by-setor.use-case';
import { FindByStatusUseCase } from '../../application/use-cases/maquinas/find-by-status.use-case';
import { FindAvailableUseCase } from '../../application/use-cases/maquinas/find-available.use-case';

@Injectable()
export class MaquinasService {
  constructor(
    private readonly createMaquinaUseCase: CreateMaquinaUseCase,
    private readonly findMaquinaUseCase: FindMaquinaUseCase,
    private readonly findAllMaquinasUseCase: FindAllMaquinasUseCase,
    private readonly updateMaquinaUseCase: UpdateMaquinaUseCase,
    private readonly deleteMaquinaUseCase: DeleteMaquinaUseCase,
    private readonly updateStatusMaquinaUseCase: UpdateStatusMaquinaUseCase,
    private readonly updateHorasUsoUseCase: UpdateHorasUsoUseCase,
    private readonly iniciarManutencaoUseCase: IniciarManutencaoUseCase,
    private readonly finalizarManutencaoUseCase: FinalizarManutencaoUseCase,
    private readonly findByCodigoUseCase: FindByCodigoUseCase,
    private readonly findBySetorUseCase: FindBySetorUseCase,
    private readonly findByStatusUseCase: FindByStatusUseCase,
    private readonly findAvailableUseCase: FindAvailableUseCase,
  ) {}

  async create(createMaquinaDto: CreateMaquinaData): Promise<Maquina> {
    return this.createMaquinaUseCase.execute(createMaquinaDto);
  }

  async findAll(filters?: any): Promise<Maquina[]> {
    return this.findAllMaquinasUseCase.execute(filters);
  }

  async findOne(id: number): Promise<Maquina> {
    const maquina = await this.findMaquinaUseCase.execute(id);
    
    if (!maquina) {
      throw new NotFoundException(`Máquina com ID ${id} não encontrada`);
    }

    return maquina;
  }

  async findByCodigo(codigo: string): Promise<Maquina | null> {
    return this.findByCodigoUseCase.execute(codigo);
  }

  async findBySetor(setorId: number): Promise<Maquina[]> {
    return this.findBySetorUseCase.execute(setorId);
  }

  async findByStatus(status: any): Promise<Maquina[]> {
    return this.findByStatusUseCase.execute(status);
  }

  async findAvailable(): Promise<Maquina[]> {
    return this.findAvailableUseCase.execute();
  }

  async update(id: number, updateMaquinaDto: any): Promise<Maquina> {
    return this.updateMaquinaUseCase.execute(id, updateMaquinaDto);
  }

  async remove(id: number): Promise<{ message: string; id: number; codigo: string }> {
    return this.deleteMaquinaUseCase.execute(id);
  }

  async updateHorasUso(id: number, horasAdicionais: number): Promise<Maquina> {
    return this.updateHorasUsoUseCase.execute(id, horasAdicionais);
  }

  // Métodos de manutenção usando os novos use cases
  async iniciarManutencao(id: number, manutencaoData: any): Promise<Maquina> {
    return this.iniciarManutencaoUseCase.execute(id, manutencaoData);
  }

  async finalizarManutencao(id: number, manutencaoData: any): Promise<Maquina> {
    return this.finalizarManutencaoUseCase.execute(id, manutencaoData);
  }

  async updateStatus(id: number, status: any, motivo?: string): Promise<Maquina> {
    return this.updateStatusMaquinaUseCase.execute(id, status, motivo);
  }
}
