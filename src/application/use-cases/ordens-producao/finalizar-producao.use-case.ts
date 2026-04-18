import { Injectable, Inject } from '@nestjs/common';
import { IOrdensProducaoRepository } from '../../../domain/repositories/ordens-producao.repository.interface';
import {
  OrdemProducao,
  StatusOP,
} from '../../../domain/entities/ordem-producao.entity';
import { ORDENS_PRODUCAO_REPOSITORY_TOKEN } from '../../../modules/ordens-producao/constants';

@Injectable()
export class FinalizarProducaoUseCase {
  constructor(
    @Inject(ORDENS_PRODUCAO_REPOSITORY_TOKEN)
    private readonly ordensProducaoRepository: IOrdensProducaoRepository,
  ) {}

  async execute(id: number): Promise<OrdemProducao> {
    // Verificar se a OP existe
    const ordemProducao = await this.ordensProducaoRepository.findOne(id);
    if (!ordemProducao) {
      throw new Error('Ordem de produção não encontrada');
    }

    // Verificar se a OP pode ser finalizada
    if (
      ordemProducao.status !== StatusOP.EM_ANDAMENTO &&
      ordemProducao.status !== StatusOP.PAUSADA
    ) {
      throw new Error(
        'Apenas ordens de produção em andamento ou pausadas podem ser finalizadas',
      );
    }

    // Finalizar produção
    const updatedOP = await this.ordensProducaoRepository.update(id, {
      status: StatusOP.FINALIZADA,
      dataFimReal: new Date(),
    });

    return updatedOP;
  }
}
