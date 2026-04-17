import { Injectable, Inject } from '@nestjs/common';
import { IOrdensProducaoRepository } from '../../../domain/repositories/ordens-producao.repository.interface';
import { OrdemProducao, StatusOP } from '../../../domain/entities/ordem-producao.entity';
import { ORDENS_PRODUCAO_REPOSITORY_TOKEN } from '../../../modules/ordens-producao/constants';

@Injectable()
export class DeleteOrdemProducaoUseCase {
  constructor(
    @Inject(ORDENS_PRODUCAO_REPOSITORY_TOKEN) private readonly ordensProducaoRepository: IOrdensProducaoRepository,
  ) {}

  async execute(id: number): Promise<{ message: string; id: number; codigo: string }> {
    // Verificar se a OP existe
    const ordemProducao = await this.ordensProducaoRepository.findOne(id);
    if (!ordemProducao) {
      throw new Error('Ordem de produção não encontrada');
    }

    // Verificar se a OP pode ser cancelada
    if (ordemProducao.status === StatusOP.EM_ANDAMENTO) {
      throw new Error('Não é possível remover uma ordem de produção em andamento');
    }

    if (ordemProducao.status === StatusOP.FINALIZADA) {
      throw new Error('Não é possível remover uma ordem de produção finalizada');
    }

    // Soft delete
    await this.ordensProducaoRepository.remove(id);

    return {
      message: 'Ordem de produção removida com sucesso',
      id: ordemProducao.id,
      codigo: ordemProducao.codigo,
    };
  }
}
