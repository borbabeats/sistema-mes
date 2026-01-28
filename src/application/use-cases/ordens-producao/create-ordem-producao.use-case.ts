import { Injectable, Inject } from '@nestjs/common';
import { IOrdensProducaoRepository, CreateOrdemProducaoData } from '../../../domain/repositories/ordens-producao.repository.interface';
import { FindSetorUseCase } from '../setores/find-setor.use-case';
import { IUsuariosRepository } from '../../../domain/repositories/usuarios.repository.interface';
import { OrdemProducao, StatusOP, PrioridadeOP } from '../../../domain/entities/ordem-producao.entity';
import { ORDENS_PRODUCAO_REPOSITORY_TOKEN } from '../../../modules/ordens-producao/constants';
import { USUARIOS_REPOSITORY_TOKEN } from '../../../modules/users/constants';

@Injectable()
export class CreateOrdemProducaoUseCase {
  constructor(
    @Inject(ORDENS_PRODUCAO_REPOSITORY_TOKEN) private readonly ordensProducaoRepository: IOrdensProducaoRepository,
    private readonly findSetorUseCase: FindSetorUseCase,
    @Inject(USUARIOS_REPOSITORY_TOKEN) private readonly usuariosRepository: IUsuariosRepository,
  ) {}

  async execute(data: CreateOrdemProducaoData): Promise<OrdemProducao> {
    // Verificar se o código já existe
    const existingOP = await this.ordensProducaoRepository.findByCodigo(data.codigo);
    if (existingOP) {
      throw new Error('Já existe uma ordem de produção com este código');
    }

    // Verificar se o setor existe
    const setor = await this.findSetorUseCase.execute(data.setorId);
    if (!setor) {
      throw new Error('Setor não encontrado');
    }

    // Verificar se o responsável existe (se fornecido)
    if (data.responsavelId) {
      const responsavel = await this.usuariosRepository.findOne(data.responsavelId);
      if (!responsavel) {
        throw new Error('Responsável não encontrado');
      }
    }

    // Validar quantidade planejada
    if (data.quantidadePlanejada <= 0) {
      throw new Error('Quantidade planejada deve ser maior que zero');
    }

    // Criar ordem de produção
    const ordemProducao = new OrdemProducao({
      ...data,
      quantidadeProduzida: 0,
      status: StatusOP.RASCUNHO,
      prioridade: data.prioridade || PrioridadeOP.MEDIA,
    });

    return this.ordensProducaoRepository.create(ordemProducao);
  }
}
