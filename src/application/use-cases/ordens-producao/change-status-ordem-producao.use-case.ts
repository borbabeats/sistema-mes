import {
  Injectable,
  Inject,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { IOrdensProducaoRepository } from '../../../domain/repositories/ordens-producao.repository.interface';
import { IOrdemProducaoStatusLogRepository } from '../../../domain/repositories/ordens-producao-status-log.repository.interface';
import {
  OrdemProducao,
  StatusOP,
} from '../../../domain/entities/ordem-producao.entity';
import {
  ORDENS_PRODUCAO_REPOSITORY_TOKEN,
  ORDEM_PRODUCAO_STATUS_LOG_REPOSITORY_TOKEN,
} from '../../../modules/ordens-producao/constants';
import { ChangeStatusOrdemProducaoDto } from '../../../presentation/dto/ordens-producao/change-status-ordem-producao.dto';
import {
  canTransition,
  getTransition,
} from '../../../domain/state-machines/ordem-producao-state-machine';

@Injectable()
export class ChangeStatusOrdemProducaoUseCase {
  constructor(
    @Inject(ORDENS_PRODUCAO_REPOSITORY_TOKEN)
    private readonly ordensProducaoRepository: IOrdensProducaoRepository,
    @Inject(ORDEM_PRODUCAO_STATUS_LOG_REPOSITORY_TOKEN)
    private readonly statusLogRepository: IOrdemProducaoStatusLogRepository,
  ) {}

  async execute(
    id: number,
    dto: ChangeStatusOrdemProducaoDto,
    userRoles: string[] = [],
    userId?: number,
  ): Promise<OrdemProducao> {
    const ordem = await this.ordensProducaoRepository.findOne(id);
    if (!ordem) {
      throw new BadRequestException('Ordem de produção não encontrada');
    }

    if (!canTransition(ordem.status, dto.novoStatus, userRoles)) {
      throw new UnauthorizedException(
        `Transição de ${ordem.status} para ${dto.novoStatus} não permitida para seu perfil`,
      );
    }

    // Validações customizadas por transição
    this.validateTransition(ordem, dto.novoStatus);

    // Gravar auditoria ANTES de mudar
    await this.statusLogRepository.create({
      ordemId: id,
      deStatus: ordem.status,
      paraStatus: dto.novoStatus,
      motivo: dto.motivo,
      usuarioId: userId,
    });

    // Atualizar status
    return this.ordensProducaoRepository.update(id, { status: dto.novoStatus });
  }

  private validateTransition(ordem: OrdemProducao, novoStatus: StatusOP): void {
    // Só pode finalizar se quantidade produzida >= planejada
    if (
      novoStatus === StatusOP.FINALIZADA &&
      ordem.quantidadeProduzida < ordem.quantidadePlanejada
    ) {
      throw new BadRequestException(
        `Não é possível finalizar. Quantidade produzida (${ordem.quantidadeProduzida}) é menor que a planejada (${ordem.quantidadePlanejada})`,
      );
    }

    // Só pode iniciar se estiver PLANEJADA
    if (
      novoStatus === StatusOP.EM_ANDAMENTO &&
      ordem.status !== StatusOP.PLANEJADA
    ) {
      throw new BadRequestException(
        'Só é possível iniciar produção a partir de uma OP PLANEJADA',
      );
    }

    // Só pode retomar se estiver PAUSADA
    if (
      novoStatus === StatusOP.EM_ANDAMENTO &&
      ordem.status === StatusOP.PAUSADA
    ) {
      // Permitido (retomar)
    } else if (
      novoStatus === StatusOP.EM_ANDAMENTO &&
      ordem.status !== StatusOP.PLANEJADA
    ) {
      throw new BadRequestException(
        'Só é possível iniciar/retomar produção a partir de PLANEJADA ou PAUSADA',
      );
    }

    // Exemplo: só pode cancelar se não estiver FINALIZADA
    if (
      novoStatus === StatusOP.CANCELADA &&
      ordem.status === StatusOP.FINALIZADA
    ) {
      throw new BadRequestException(
        'Não é possível cancelar uma OP já finalizada',
      );
    }
  }
}
