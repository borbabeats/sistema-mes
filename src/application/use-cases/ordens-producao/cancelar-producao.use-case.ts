import { Injectable, Inject } from '@nestjs/common';
import { IOrdensProducaoRepository } from '../../../domain/repositories/ordens-producao.repository.interface';
import { OrdemProducao, StatusOP } from '../../../domain/entities/ordem-producao.entity';
import { ORDENS_PRODUCAO_REPOSITORY_TOKEN } from '../../../modules/ordens-producao/constants';

@Injectable()
export class CancelarProducaoUseCase {
  constructor(
    @Inject(ORDENS_PRODUCAO_REPOSITORY_TOKEN) private readonly ordensProducaoRepository: IOrdensProducaoRepository,
  ) {}

  async execute(id: number, motivo?: string): Promise<OrdemProducao> {
    // Verificar se a OP existe
    const ordemProducao = await this.ordensProducaoRepository.findOne(id);
    if (!ordemProducao) {
      throw new Error('Ordem de produção não encontrada');
    }

    // Verificar se a OP pode ser cancelada
    if (ordemProducao.status === StatusOP.FINALIZADA) {
      throw new Error('Não é possível cancelar uma ordem de produção finalizada');
    }

    // Cancelar produção
    const updateData: any = {
      status: StatusOP.CANCELADA,
    };

    // Se estava em andamento, registrar data de fim
    if (ordemProducao.status === StatusOP.EM_ANDAMENTO) {
      updateData.dataFimReal = new Date();
    }

    // Adicionar motivo nas observações se fornecido
    if (motivo) {
      updateData.observacoes = ordemProducao.observacoes 
        ? `${ordemProducao.observacoes}\n\nCancelado: ${motivo}`
        : `Cancelado: ${motivo}`;
    }

    const updatedOP = await this.ordensProducaoRepository.update(id, updateData);

    return updatedOP;
  }
}
