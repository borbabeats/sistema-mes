import { Injectable, Inject } from '@nestjs/common';
import { IMaquinasRepository, UpdateMaquinaData } from '../../../domain/repositories/maquinas.repository.interface';
import { Maquina, StatusMaquina } from '../../../domain/entities/maquina.entity';
import { MAQUINAS_REPOSITORY_TOKEN } from '../../../domain/repositories/maquinas.repository.interface';
import { FindSetorUseCase } from '../setores/find-setor.use-case';

@Injectable()
export class UpdateMaquinaUseCase {
  constructor(
    @Inject(MAQUINAS_REPOSITORY_TOKEN) private readonly maquinasRepository: IMaquinasRepository,
    private readonly findSetorUseCase: FindSetorUseCase,
  ) {}

  async execute(id: number, data: UpdateMaquinaData): Promise<Maquina> {
    // Verificar se a máquina existe
    const maquina = await this.maquinasRepository.findOne(id);
    if (!maquina) {
      throw new Error('Máquina não encontrada');
    }

    // Verificar se o código já existe (se fornecido e for diferente)
    if (data.codigo && data.codigo !== maquina.codigo) {
      const existingMaquina = await this.maquinasRepository.findByCodigo(data.codigo);
      if (existingMaquina) {
        throw new Error('Já existe uma máquina com este código');
      }
    }

    // Validar setor (se fornecido)
    if (data.setorId) {
      const setor = await this.findSetorUseCase.execute(data.setorId);
      if (!setor) {
        throw new Error('Setor não encontrado');
      }
    }

    // Validar ano de fabricação (se fornecido)
    if (data.anoFabricacao && data.anoFabricacao < 1900) {
      throw new Error('Ano de fabricação inválido');
    }

    // Validar ano de fabricação (se fornecido)
    if (data.anoFabricacao && data.anoFabricacao > new Date().getFullYear()) {
      throw new Error('Ano de fabricação não pode ser maior que o ano atual');
    }

    // Validar status (se fornecido)
    if (data.status && !Object.values(StatusMaquina).includes(data.status)) {
      throw new Error('Status inválido');
    }

    return this.maquinasRepository.update(id, data);
  }
}
