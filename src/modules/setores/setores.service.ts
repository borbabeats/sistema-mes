import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';
import { ISetoresRepository } from '../../domain/repositories/setores.repository.interface';
import { CreateSetorDto } from '../../presentation/dto/setores/create-setor.dto';
import { UpdateSetorDto } from '../../presentation/dto/setores/update-setor.dto';
import { Setor } from '../../domain/entities/setor.entity';
import { SETORES_REPOSITORY_TOKEN } from './constants';

@Injectable()
export class SetoresService {
  constructor(@Inject(SETORES_REPOSITORY_TOKEN) private readonly setorRepository: ISetoresRepository) {}

  async create(createSetorDto: CreateSetorDto): Promise<Setor> {
    const setorExistente = await this.setorRepository.findByNome(createSetorDto.nome);

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

    return this.setorRepository.update(id, updateSetorDto);
  }

  async remove(id: number): Promise<Setor> {
    return this.setorRepository.remove(id);
  }

}
