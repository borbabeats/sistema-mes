import { Injectable, Inject } from '@nestjs/common';
import { IApontamentosRepository, APONTAMENTOS_REPOSITORY_TOKEN } from '../../../domain/repositories/apontamentos.repository.interface';
import { IMaquinasRepository, MAQUINAS_REPOSITORY_TOKEN } from '../../../domain/repositories/maquinas.repository.interface';
import { IOrdensProducaoRepository } from '../../../domain/repositories/ordens-producao.repository.interface';
import { Apontamento } from '../../../domain/entities/apontamento.entity';
import { StatusMaquina } from '../../../domain/entities/maquina.entity';
import { StatusOP } from '../../../domain/entities/ordem-producao.entity';
import { ORDENS_PRODUCAO_REPOSITORY_TOKEN } from '../../../modules/ordens-producao/constants';

@Injectable()
export class FinalizeApontamentoUseCase {
  constructor(
    @Inject(APONTAMENTOS_REPOSITORY_TOKEN) private readonly apontamentosRepository: IApontamentosRepository,
    @Inject(MAQUINAS_REPOSITORY_TOKEN) private readonly maquinasRepository: IMaquinasRepository,
    @Inject(ORDENS_PRODUCAO_REPOSITORY_TOKEN) private readonly ordensProducaoRepository: IOrdensProducaoRepository,
  ) {}

  async execute(id: number, quantidadeProduzida?: number, quantidadeDefeito?: number): Promise<Apontamento> {
    const apontamento = await this.apontamentosRepository.findOne(id);
    if (!apontamento) {
      throw new Error('Apontamento não encontrado');
    }

    if (apontamento.isCompleted()) {
      throw new Error('Apontamento já foi finalizado');
    }

    // Atualizar quantidades se fornecidas
    const updateData: any = {
      dataFim: new Date(),
    };

    if (quantidadeProduzida !== undefined) {
      updateData.quantidadeProduzida = quantidadeProduzida;
    }

    if (quantidadeDefeito !== undefined) {
      updateData.quantidadeDefeito = quantidadeDefeito;
    }

    // Finalizar apontamento
    const updatedApontamento = await this.apontamentosRepository.update(id, updateData);

    // Atualizar status da máquina para DISPONIVEL
    const maquina = await this.maquinasRepository.findOne(apontamento.maquinaId);
    if (maquina) {
      await this.maquinasRepository.update(apontamento.maquinaId, { status: StatusMaquina.DISPONIVEL });
    }

    // Atualizar quantidade produzida na ordem de produção
    const ordemProducao = await this.ordensProducaoRepository.findOne(apontamento.opId);
    if (ordemProducao) {
      const novaQuantidade = ordemProducao.quantidadeProduzida + (quantidadeProduzida || apontamento.quantidadeProduzida);
      await this.ordensProducaoRepository.updateQuantidadeProduzida(apontamento.opId, novaQuantidade);

      // Verificar se a ordem de produção foi concluída
      if (novaQuantidade >= ordemProducao.quantidadePlanejada) {
        await this.ordensProducaoRepository.update(apontamento.opId, {
          status: StatusOP.FINALIZADA,
          dataFimReal: new Date(),
        });
      }
    }

    return updatedApontamento;
  }
}
