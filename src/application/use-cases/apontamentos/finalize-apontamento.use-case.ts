import { Injectable, Inject } from '@nestjs/common';
import { IApontamentosRepository, APONTAMENTOS_REPOSITORY_TOKEN } from '../../../domain/repositories/apontamentos.repository.interface';
import { Apontamento } from '../../../domain/entities/apontamento.entity';
import { FindMaquinaUseCase } from '../maquinas/find-maquina.use-case';
import { FindOrdemProducaoUseCase } from '../ordens-producao/find-ordem-producao.use-case';
import { UpdateStatusMaquinaUseCase } from '../maquinas/update-status-maquina.use-case';
import { UpdateQuantidadeProduzidaUseCase } from '../ordens-producao/update-quantidade-produzida.use-case';
import { FinalizarProducaoUseCase } from '../ordens-producao/finalizar-producao.use-case';
import { StatusMaquina } from '../../../domain/entities/maquina.entity';

@Injectable()
export class FinalizeApontamentoUseCase {
  constructor(
    @Inject(APONTAMENTOS_REPOSITORY_TOKEN) private readonly apontamentosRepository: IApontamentosRepository,
    private readonly findMaquinaUseCase: FindMaquinaUseCase,
    private readonly findOrdemProducaoUseCase: FindOrdemProducaoUseCase,
    private readonly updateStatusMaquinaUseCase: UpdateStatusMaquinaUseCase,
    private readonly updateQuantidadeProduzidaUseCase: UpdateQuantidadeProduzidaUseCase,
    private readonly finalizarProducaoUseCase: FinalizarProducaoUseCase,
  ) {}

  async execute(id: number, quantidadeProduzida?: number, quantidadeDefeito?: number): Promise<Apontamento> {
    const apontamento = await this.apontamentosRepository.findOne(id);
    if (!apontamento) {
      throw new Error('Apontamento não encontrado');
    }

    if (apontamento.isCompleted()) {
      throw new Error('Apontamento já foi finalizado');
    }

    // Validar quantidades
    if (quantidadeProduzida && quantidadeProduzida < 0) {
      throw new Error('Quantidade produzida não pode ser negativa');
    }

    if (quantidadeDefeito && quantidadeDefeito < 0) {
      throw new Error('Quantidade de defeito não pode ser negativa');
    }

    // Preparar dados de atualização
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
    const maquina = await this.findMaquinaUseCase.execute(apontamento.maquinaId);
    if (maquina) {
      await this.updateStatusMaquinaUseCase.execute(apontamento.maquinaId, StatusMaquina.DISPONIVEL);
    }

    // Atualizar quantidade produzida na ordem de produção
    const ordemProducao = await this.findOrdemProducaoUseCase.execute(apontamento.opId);
    if (ordemProducao) {
      const novaQuantidade = ordemProducao.quantidadeProduzida + (quantidadeProduzida || apontamento.quantidadeProduzida);
      await this.updateQuantidadeProduzidaUseCase.execute(apontamento.opId, novaQuantidade);

      // Verificar se a ordem de produção foi concluída e finalizar automaticamente
      if (novaQuantidade >= ordemProducao.quantidadePlanejada && ordemProducao.status !== 'FINALIZADA') {
        await this.finalizarProducaoUseCase.execute(apontamento.opId);
      }
    }

    return updatedApontamento;
  }
}
