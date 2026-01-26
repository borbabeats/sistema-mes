import { Injectable, NotFoundException } from '@nestjs/common';
import { IApontamentosRepository } from './interfaces/apontamentos.repository.interface';
import { CreateApontamentoDto } from './dto/create-apontamento.dto';
import { UpdateApontamentoDto } from './dto/update-apontamento.dto';
import { Apontamento } from './entities/apontamento.entity';

@Injectable()
export class ApontamentosService {
  constructor(private readonly repository: IApontamentosRepository) {}

  async create(createApontamentoDto: CreateApontamentoDto): Promise<Apontamento> {
    return this.repository.create(createApontamentoDto);
  }

  async findAll(filters?: any): Promise<Apontamento[]> {
    return this.repository.findAll(filters);
  }

  async findOne(id: number): Promise<Apontamento> {
    const apontamento = await this.repository.findOne(id);
    
    if (!apontamento) {
      throw new NotFoundException(`Apontamento com ID ${id} não encontrado`);
    }

    return apontamento as Apontamento;
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

  async update(id: number, updateApontamentoDto: UpdateApontamentoDto): Promise<Apontamento> {
    await this.findOne(id); // Verifica se existe
    const updated = await this.repository.update(id, updateApontamentoDto);
    return updated as Apontamento;
  }

  async remove(id: number): Promise<Apontamento> {
    await this.findOne(id); // Verifica se existe
    const removed = await this.repository.remove(id);
    return removed as Apontamento;
  }
}
