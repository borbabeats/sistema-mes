import { Injectable, Inject } from '@nestjs/common';
import {
  IApontamentosRepository,
  APONTAMENTOS_REPOSITORY_TOKEN,
} from '../../../domain/repositories/apontamentos.repository.interface';
import { Apontamento } from '../../../domain/entities/apontamento.entity';
import { FindMaquinaUseCase } from '../maquinas/find-maquina.use-case';

@Injectable()
export class FindByMaquinaUseCase {
  constructor(
    @Inject(APONTAMENTOS_REPOSITORY_TOKEN)
    private readonly apontamentosRepository: IApontamentosRepository,
    private readonly findMaquinaUseCase: FindMaquinaUseCase,
  ) {}

  async execute(maquinaId: number): Promise<Apontamento[]> {
    // Validar se a máquina existe
    const maquina = await this.findMaquinaUseCase.execute(maquinaId);
    if (!maquina) {
      throw new Error('Máquina não encontrada');
    }

    return this.apontamentosRepository.findByMaquina(maquinaId);
  }
}
