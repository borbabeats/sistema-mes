import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { ISetorRepository } from './interfaces/setor.repository.interface';
import { CreateSetorDto } from './dto/create-setor.dto';
import { UpdateSetorDto } from './dto/update-setor.dto';
import { Setor } from './entities/setor.entity';

@Injectable()
export class SetoresService {
  constructor(private readonly setorRepository: ISetorRepository) {}

  async create(createSetorDto: CreateSetorDto): Promise<Setor> {
    const setorExistente = await this.setorRepository.findByName(createSetorDto.nome);

    if (setorExistente) {
      throw new ConflictException('Já existe um setor com este nome');
    }

    return this.setorRepository.create({
      nome: createSetorDto.nome,
    });
  }

  async findAll(): Promise<Setor[]> {
    return this.setorRepository.findAll();
  }

  async findOne(id: number): Promise<Setor> {
    const setor = await this.setorRepository.findOne(id);

    if (!setor) {
      throw new NotFoundException(`Setor com ID ${id} não encontrado`);
    }

    return setor;
  }

  async update(id: number, updateSetorDto: UpdateSetorDto): Promise<Setor> {
    await this.findOne(id);

    if (updateSetorDto.nome) {
      const setorComMesmoNome = await this.setorRepository.findByNameExcludingId(
        updateSetorDto.nome,
        id
      );

      if (setorComMesmoNome) {
        throw new ConflictException('Já existe um setor com este nome');
      }
    }

    return this.setorRepository.update(id, updateSetorDto);
  }

  async remove(id: number): Promise<Setor> {
    return this.setorRepository.remove(id);
  }

  async findDeleted(): Promise<Setor[]> {
    return this.setorRepository.findDeleted();
  }

  async restore(id: number): Promise<Setor> {
    const setor = await this.setorRepository.restore(id);
    
    if (!setor) {
      throw new NotFoundException(`Setor com ID ${id} não encontrado ou já restaurado`);
    }
    
    return setor;
  }
}
