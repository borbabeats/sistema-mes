import { Injectable, Inject } from '@nestjs/common';
import { IOrdensProducaoRepository, UpdateOrdemProducaoData } from '../../../domain/repositories/ordens-producao.repository.interface';
import { OrdemProducao, StatusOP, PrioridadeOP } from '../../../domain/entities/ordem-producao.entity';
import { ORDENS_PRODUCAO_REPOSITORY_TOKEN } from '../../../modules/ordens-producao/constants';
import { FindSetorUseCase } from '../setores/find-setor.use-case';
import { FindUsuarioUseCase } from '../usuarios/find-usuario.use-case';

@Injectable()
export class UpdateOrdemProducaoUseCase {
  constructor(
    @Inject(ORDENS_PRODUCAO_REPOSITORY_TOKEN) private readonly ordensProducaoRepository: IOrdensProducaoRepository,
    private readonly findSetorUseCase: FindSetorUseCase,
    private readonly findUsuarioUseCase: FindUsuarioUseCase,
  ) {}

  async execute(id: number, data: UpdateOrdemProducaoData): Promise<OrdemProducao> {
    // Verificar se a OP existe
    const ordemProducao = await this.ordensProducaoRepository.findOne(id);
    if (!ordemProducao) {
      throw new Error('Ordem de produção não encontrada');
    }

    // Verificar se o código já existe (se fornecido e for diferente)
    if (data.codigo && data.codigo !== ordemProducao.codigo) {
      const existingOP = await this.ordensProducaoRepository.findByCodigo(data.codigo);
      if (existingOP) {
        throw new Error('Já existe uma ordem de produção com este código');
      }
    }

    // Validar setor (se fornecido)
    if (data.setorId) {
      const setor = await this.findSetorUseCase.execute(data.setorId);
      if (!setor) {
        throw new Error('Setor não encontrado');
      }
    }

    // Validar responsável (se fornecido)
    if (data.responsavelId) {
      const responsavel = await this.findUsuarioUseCase.execute(data.responsavelId);
      if (!responsavel) {
        throw new Error('Responsável não encontrado');
      }
    }

    // Validar quantidade planejada (se fornecida)
    if (data.quantidadePlanejada && data.quantidadePlanejada <= 0) {
      throw new Error('Quantidade planejada deve ser maior que zero');
    }

    // Validar quantidade produzida (se fornecida)
    if (data.quantidadeProduzida && data.quantidadeProduzida < 0) {
      throw new Error('Quantidade produzida não pode ser negativa');
    }

    // Validar status (se fornecido)
    if (data.status && !Object.values(StatusOP).includes(data.status)) {
      throw new Error('Status inválido');
    }

    // Validar prioridade (se fornecida)
    if (data.prioridade && !Object.values(PrioridadeOP).includes(data.prioridade)) {
      throw new Error('Prioridade inválida');
    }

    return this.ordensProducaoRepository.update(id, data);
  }
}
