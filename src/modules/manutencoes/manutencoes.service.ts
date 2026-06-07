import { Injectable } from '@nestjs/common';
import { AgendarManutencaoUseCase } from '../../application/use-cases/manutencoes/agendar-manutencao.use-case';
import { CancelarManutencaoUseCase } from '../../application/use-cases/manutencoes/cancelar-manutencao.use-case';
import { NotificacoesGateway } from '../notificacoes/notificacoes.gateway';
import { StatusManutencao } from '../../domain/entities/manutencao.entity';

@Injectable()
export class ManutencoesService {
  constructor(
    private readonly agendarManutencaoUseCase: AgendarManutencaoUseCase,
    private readonly cancelarManutencaoUseCase: CancelarManutencaoUseCase,
    private readonly notificacoesGateway: NotificacoesGateway,
  ) {}

  async cancelar(id: number, data: { motivo: string; observacoes?: string }) {
    const manutencao = await this.cancelarManutencaoUseCase.execute(id, data);
    this.notificacoesGateway.emitirStatusManutencao({
      id: manutencao.id,
      maquinaId: manutencao.maquinaId,
      statusAnterior: StatusManutencao.EM_ANDAMENTO,
      statusNovo: StatusManutencao.CANCELADA,
    });
    return manutencao;
  }
}
