import { OrdemProducaoStatusLog } from '../entities/ordens-producao-status-log.entity';

export interface IOrdemProducaoStatusLogRepository {
  create(data: {
    ordemId: number;
    deStatus: string;
    paraStatus: string;
    motivo?: string;
    usuarioId?: number;
  }): Promise<OrdemProducaoStatusLog>;

  findByOrdemId(ordemId: number): Promise<OrdemProducaoStatusLog[]>;
}
