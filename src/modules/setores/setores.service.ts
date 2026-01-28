import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateSetorDto } from '../../presentation/dto/setores/create-setor.dto';
import { UpdateSetorDto } from '../../presentation/dto/setores/update-setor.dto';
import { Setor } from '../../domain/entities/setor.entity';
import { CreateSetorUseCase } from '../../application/use-cases/setores/create-setor.use-case';
import { FindSetorUseCase } from '../../application/use-cases/setores/find-setor.use-case';
import { FindAllSetoresUseCase } from '../../application/use-cases/setores/find-all-setores.use-case';
import { UpdateSetorUseCase } from '../../application/use-cases/setores/update-setor.use-case';
import { DeleteSetorUseCase } from '../../application/use-cases/setores/delete-setor.use-case';

@Injectable()
export class SetoresService {
  constructor(
    private readonly createSetorUseCase: CreateSetorUseCase,
    private readonly findSetorUseCase: FindSetorUseCase,
    private readonly findAllSetoresUseCase: FindAllSetoresUseCase,
    private readonly updateSetorUseCase: UpdateSetorUseCase,
    private readonly deleteSetorUseCase: DeleteSetorUseCase,
  ) {}

  async create(createSetorDto: CreateSetorDto): Promise<Setor> {
    return this.createSetorUseCase.execute({
      nome: createSetorDto.nome,
    });
  }

  async findAll(): Promise<Setor[]> {
    return this.findAllSetoresUseCase.execute();
  }

  async findOne(id: number): Promise<Setor> {
    const setor = await this.findSetorUseCase.execute(id);

    if (!setor) {
      throw new NotFoundException(`Setor com ID ${id} não encontrado`);
    }

    return setor;
  }

  async update(id: number, updateSetorDto: UpdateSetorDto): Promise<Setor> {
    return this.updateSetorUseCase.execute(id, updateSetorDto);
  }

  async remove(id: number): Promise<{ message: string; id: number; nome: string }> {
    return this.deleteSetorUseCase.execute(id);
  }

}
