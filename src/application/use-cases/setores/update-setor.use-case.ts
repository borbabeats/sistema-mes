import { Injectable, Inject } from '@nestjs/common';
import { ISetoresRepository, UpdateSetorData } from '../../../domain/repositories/setores.repository.interface';
import { Setor } from '../../../domain/entities/setor.entity';
import { SETORES_REPOSITORY_TOKEN } from '../../../modules/setores/constants';

@Injectable()
export class UpdateSetorUseCase {
  constructor(
    @Inject(SETORES_REPOSITORY_TOKEN) private readonly setoresRepository: ISetoresRepository,
  ) {}

  async execute(id: number, data: UpdateSetorData): Promise<Setor> {
    // Verificar se o setor existe
    const setor = await this.setoresRepository.findOne(id);
    if (!setor) {
      throw new Error('Setor não encontrado');
    }

    // Verificar se o nome já existe (se fornecido e for diferente)
    if (data.nome && data.nome !== setor.nome) {
      const existingSetor = await this.setoresRepository.findByNome(data.nome);
      if (existingSetor) {
        throw new Error('Já existe um setor com este nome');
      }
    }

    // Validar nome (se fornecido)
    if (data.nome && data.nome.trim().length < 3) {
      throw new Error('Nome deve ter pelo menos 3 caracteres');
    }

    return this.setoresRepository.update(id, data);
  }
}
