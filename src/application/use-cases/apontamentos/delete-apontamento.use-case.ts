import { Injectable, Inject } from '@nestjs/common';
import { IApontamentosRepository, APONTAMENTOS_REPOSITORY_TOKEN } from '../../../domain/repositories/apontamentos.repository.interface';
import { Apontamento } from '../../../domain/entities/apontamento.entity';

@Injectable()
export class DeleteApontamentoUseCase {
  constructor(
    @Inject(APONTAMENTOS_REPOSITORY_TOKEN) private readonly apontamentosRepository: IApontamentosRepository,
  ) {}

  async execute(id: number): Promise<{ message: string; id: number }> {
    // Verificar se o apontamento existe
    const apontamento = await this.apontamentosRepository.findOne(id);
    if (!apontamento) {
      throw new Error('Apontamento não encontrado');
    }

    // Verificar se o apontamento pode ser removido
    if (apontamento.dataFim === null) {
      throw new Error('Não é possível remover um apontamento em andamento');
    }

    // Remover apontamento
    await this.apontamentosRepository.remove(id);

    return {
      message: 'Apontamento removido com sucesso',
      id: apontamento.id,
    };
  }
}
