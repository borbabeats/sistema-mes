import { Injectable, Inject } from '@nestjs/common';
import { IOrdensProducaoRepository } from '../../../domain/repositories/ordens-producao.repository.interface';
import { OrdemProducao } from '../../../domain/entities/ordem-producao.entity';
import { ORDENS_PRODUCAO_REPOSITORY_TOKEN } from '../../../modules/ordens-producao/constants';
import { FindSetorUseCase } from '../setores/find-setor.use-case';

@Injectable()
export class FindBySetorUseCase {
  constructor(
    @Inject(ORDENS_PRODUCAO_REPOSITORY_TOKEN) private readonly ordensProducaoRepository: IOrdensProducaoRepository,
    private readonly findSetorUseCase: FindSetorUseCase,
  ) {}

  async execute(setorId: number): Promise<OrdemProducao[]> {
    // Validar se o setor existe
    const setor = await this.findSetorUseCase.execute(setorId);
    if (!setor) {
      throw new Error('Setor não encontrado');
    }

    return this.ordensProducaoRepository.findBySetor(setorId);
  }
}
