import { StatusOP } from './ordem-producao.entity';

export class OrdemProducaoStatusLog {
  id: number;
  ordemId: number;
  deStatus: StatusOP;
  paraStatus: StatusOP;
  motivo?: string;
  usuarioId?: number;
  createdAt: Date;

  constructor(data: Partial<OrdemProducaoStatusLog>) {
    Object.assign(this, data);
  }
}
