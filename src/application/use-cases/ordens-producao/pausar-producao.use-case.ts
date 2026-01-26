import { Injectable, Inject } from '@nestjs/common';
import { IOrdensProducaoRepository } from '../../../domain/repositories/ordens-producao.repository.interface';
import { OrdemProducao, StatusOP } from '../../../domain/entities/ordem-producao.entity';
import { ORDENS_PRODUCAO_REPOSITORY_TOKEN } from '../../../modules/ordens-producao/constants';

@Injectable()
export class PausarProducaoUseCase {
  constructor(
    @Inject(ORDENS_PRODUCAO_REPOSITORY_TOKEN) private readonly ordensProducaoRepository: IOrdensProducaoRepository,
  ) {}

  async execute(id: number): Promise<OrdemProducao> {
    // Verificar se a OP existe
    const ordemProducao = await this.ordensProducaoRepository.findOne(id);
    if (!ordemProducao) {
      throw new Error('Ordem de produção não encontrada');
    }

    // Verificar se a OP pode ser pausada
    if (ordemProducao.status !== StatusOP.EM_ANDAMENTO) {
      throw new Error('Apenas ordens de produção em andamento podem ser pausadas');
    }

    // Pausar produção
    const updatedOP = await this.ordensProducaoRepository.update(id, {
      status: StatusOP.PAUSADA,
    });

    return updatedOP;
  }
}
