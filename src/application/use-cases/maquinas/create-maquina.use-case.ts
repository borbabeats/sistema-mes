import { Injectable, Inject } from '@nestjs/common';
import { IMaquinasRepository, CreateMaquinaData, MAQUINAS_REPOSITORY_TOKEN } from '../../../domain/repositories/maquinas.repository.interface';
import { Maquina, StatusMaquina } from '../../../domain/entities/maquina.entity';
import { FindSetorUseCase } from '../setores/find-setor.use-case';

@Injectable()
export class CreateMaquinaUseCase {
  constructor(
    @Inject(MAQUINAS_REPOSITORY_TOKEN) private readonly maquinasRepository: IMaquinasRepository,
    private readonly findSetorUseCase: FindSetorUseCase,
  ) {}

  async execute(data: CreateMaquinaData): Promise<Maquina> {
    // Verificar se o código já existe
    const existingMaquina = await this.maquinasRepository.findByCodigo(data.codigo);
    if (existingMaquina) {
      throw new Error('Já existe uma máquina com este código');
    }

    // Verificar se o setor existe (se fornecido)
    if (data.setorId) {
      const setor = await this.findSetorUseCase.execute(data.setorId);
      if (!setor) {
        throw new Error('Setor não encontrado');
      }
    }

    // Criar máquina com status padrão DISPONIVEL
    const maquina = new Maquina({
      ...data,
      status: data.status || StatusMaquina.DISPONIVEL,
      horasUso: 0,
    });

    return this.maquinasRepository.create(maquina);
  }
}
