import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSetorDto } from '../../presentation/dto/setores/create-setor.dto';
import { UpdateSetorDto } from '../../presentation/dto/setores/update-setor.dto';
import { SetorResponseDto } from '../../presentation/dto/setores/setor-response.dto';
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

  private toSetorResponseDto(setor: Setor): SetorResponseDto {
    return {
      id: setor.id,
      nome: setor.nome,
      qtdUsuarios: setor.qtdUsuarios,
      qtdMaquinas: setor.qtdMaquinas,
      usuarios: setor.usuarios,
      maquinas: setor.maquinas,
      created_at: setor.created_at,
      updated_at: setor.updated_at,
      deleted_at: setor.deleted_at,
    };
  }

  async create(createSetorDto: CreateSetorDto): Promise<SetorResponseDto> {
    const setor = await this.createSetorUseCase.execute({
      nome: createSetorDto.nome,
    });
    return this.toSetorResponseDto(setor);
  }

  async findAll(): Promise<SetorResponseDto[]> {
    const setores = await this.findAllSetoresUseCase.execute();
    return setores.map((setor) => this.toSetorResponseDto(setor));
  }

  async findOne(id: number): Promise<SetorResponseDto> {
    const setor = await this.findSetorUseCase.execute(id);

    if (!setor) {
      throw new NotFoundException(`Setor com ID ${id} não encontrado`);
    }

    return this.toSetorResponseDto(setor);
  }

  async update(
    id: number,
    updateSetorDto: UpdateSetorDto,
  ): Promise<SetorResponseDto> {
    const setor = await this.updateSetorUseCase.execute(id, updateSetorDto);
    return this.toSetorResponseDto(setor);
  }

  async remove(
    id: number,
  ): Promise<{ message: string; id: number; nome: string }> {
    return this.deleteSetorUseCase.execute(id);
  }
}
