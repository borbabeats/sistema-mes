import { Injectable, Inject } from '@nestjs/common';
import { IOrdensProducaoRepository } from '../../../domain/repositories/ordens-producao.repository.interface';
import { OrdemProducao, StatusOP } from '../../../domain/entities/ordem-producao.entity';
import { ORDENS_PRODUCAO_REPOSITORY_TOKEN } from '../../../modules/ordens-producao/constants';

@Injectable()
export class RetomarProducaoUseCase {
  constructor(
    @Inject(ORDENS_PRODUCAO_REPOSITORY_TOKEN) private readonly ordensProducaoRepository: IOrdensProducaoRepository,
  ) {}

  async execute(id: number): Promise<OrdemProducao> {
    // Verificar se a OP existe
    const ordemProducao = await this.ordensProducaoRepository.findOne(id);
    if (!ordemProducao) {
      throw new Error('Ordem de produção não encontrada');
    }

    // Verificar se a OP pode ser retomada
    if (ordemProducao.status !== StatusOP.PAUSADA) {
      throw new Error('Apenas ordens de produção pausadas podem ser retomadas');
    }

    // Retomar produção
    const updatedOP = await this.ordensProducaoRepository.update(id, {
      status: StatusOP.EM_ANDAMENTO,
    });

    return updatedOP;
  }
}
