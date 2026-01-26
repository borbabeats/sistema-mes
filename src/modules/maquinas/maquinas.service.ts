import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IMaquinasRepository, MAQUINAS_REPOSITORY_TOKEN } from '../../domain/repositories/maquinas.repository.interface';
import { CreateMaquinaUseCase } from '../../application/use-cases/maquinas/create-maquina.use-case';
import { Maquina } from '../../domain/entities/maquina.entity';
import { CreateMaquinaData } from '../../domain/repositories/maquinas.repository.interface';

@Injectable()
export class MaquinasService {
  constructor(
    @Inject(MAQUINAS_REPOSITORY_TOKEN) private readonly repository: IMaquinasRepository,
    private readonly createMaquinaUseCase: CreateMaquinaUseCase,
  ) {}

  async create(createMaquinaDto: CreateMaquinaData): Promise<Maquina> {
    return this.createMaquinaUseCase.execute(createMaquinaDto);
  }

  async findAll(filters?: any): Promise<Maquina[]> {
    return this.repository.findAll(filters);
  }

  async findOne(id: number): Promise<Maquina> {
    const maquina = await this.repository.findOne(id);
    
    if (!maquina) {
      throw new NotFoundException(`Máquina com ID ${id} não encontrada`);
    }

    return maquina;
  }

  async findByCodigo(codigo: string): Promise<Maquina | null> {
    return this.repository.findByCodigo(codigo);
  }

  async findBySetor(setorId: number): Promise<Maquina[]> {
    return this.repository.findBySetor(setorId);
  }

  async findByStatus(status: any): Promise<Maquina[]> {
    return this.repository.findByStatus(status);
  }

  async findAvailable(): Promise<Maquina[]> {
    return this.repository.findAvailable();
  }

  async update(id: number, updateMaquinaDto: any): Promise<Maquina> {
    await this.findOne(id);
    return this.repository.update(id, updateMaquinaDto);
  }

  async remove(id: number): Promise<Maquina> {
    await this.findOne(id);
    return this.repository.remove(id);
  }

  async updateHorasUso(id: number, horasAdicionais: number): Promise<Maquina> {
    await this.findOne(id);
    return this.repository.updateHorasUso(id, horasAdicionais);
  }

  // TODO: Implementar métodos de manutenção quando os DTOs estiverem disponíveis na clean architecture
  /*
  async createManutencao(data: any): Promise<any> {
    // TODO: Implement manutenção creation logic
    throw new Error('Method not implemented');
  }

  async findAllManutencoes(maquinaId: number, status?: any): Promise<any[]> {
    // TODO: Implement manutenção listing logic
    throw new Error('Method not implemented');
  }

  async findManutencaoById(id: number): Promise<any> {
    // TODO: Implement manutenção find by id logic
    throw new Error('Method not implemented');
  }

  async updateManutencao(id: number, data: any): Promise<any> {
    // TODO: Implement manutenção update logic
    throw new Error('Method not implemented');
  }

  async removeManutencao(id: number): Promise<any> {
    // TODO: Implement manutenção removal logic
    throw new Error('Method not implemented');
  }

  async findHistoricoManutencao(manutencaoId: number): Promise<any[]> {
    // TODO: Implement histórico manutenção logic
    throw new Error('Method not implemented');
  }

  async getTempoUsoMaquina(maquinaId: number, inicio: Date, fim: Date): Promise<any> {
    // TODO: Implement tempo uso calculation logic
    throw new Error('Method not implemented');
  }
  */
}
