import { Injectable, Inject } from '@nestjs/common';
import { IOrdensProducaoRepository } from '../../../domain/repositories/ordens-producao.repository.interface';
import { OrdemProducao, StatusOP } from '../../../domain/entities/ordem-producao.entity';
import { ORDENS_PRODUCAO_REPOSITORY_TOKEN } from '../../../modules/ordens-producao/constants';

@Injectable()
export class UpdateQuantidadeProduzidaUseCase {
  constructor(
    @Inject(ORDENS_PRODUCAO_REPOSITORY_TOKEN) private readonly ordensProducaoRepository: IOrdensProducaoRepository,
  ) {}

  async execute(id: number, quantidade: number): Promise<OrdemProducao> {
    // Verificar se a OP existe
    const ordemProducao = await this.ordensProducaoRepository.findOne(id);
    if (!ordemProducao) {
      throw new Error('Ordem de produção não encontrada');
    }

    // Validar quantidade
    if (quantidade < 0) {
      throw new Error('Quantidade produzida não pode ser negativa');
    }

    // Atualizar quantidade produzida
    const updatedOP = await this.ordensProducaoRepository.updateQuantidadeProduzida(id, quantidade);

    // Verificar se a ordem foi concluída e finalizar automaticamente
    if (quantidade >= ordemProducao.quantidadePlanejada && ordemProducao.status === StatusOP.EM_ANDAMENTO) {
      await this.ordensProducaoRepository.update(id, {
        status: StatusOP.FINALIZADA,
        dataFimReal: new Date(),
      });
    }

    return updatedOP;
  }
}
