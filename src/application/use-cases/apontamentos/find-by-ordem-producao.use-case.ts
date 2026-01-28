import { Injectable, Inject } from '@nestjs/common';
import { IApontamentosRepository, APONTAMENTOS_REPOSITORY_TOKEN } from '../../../domain/repositories/apontamentos.repository.interface';
import { Apontamento } from '../../../domain/entities/apontamento.entity';
import { FindOrdemProducaoUseCase } from '../ordens-producao/find-ordem-producao.use-case';

@Injectable()
export class FindByOrdemProducaoUseCase {
  constructor(
    @Inject(APONTAMENTOS_REPOSITORY_TOKEN) private readonly apontamentosRepository: IApontamentosRepository,
    private readonly findOrdemProducaoUseCase: FindOrdemProducaoUseCase,
  ) {}

  async execute(opId: number): Promise<Apontamento[]> {
    // Validar se a ordem de produção existe
    const ordemProducao = await this.findOrdemProducaoUseCase.execute(opId);
    if (!ordemProducao) {
      throw new Error('Ordem de produção não encontrada');
    }

    return this.apontamentosRepository.findByOrdemProducao(opId);
  }
}
