export enum StatusOP {
  RASCUNHO = 'RASCUNHO',
  PLANEJADA = 'PLANEJADA',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  PAUSADA = 'PAUSADA',
  FINALIZADA = 'FINALIZADA',
  CANCELADA = 'CANCELADA',
  ATRASADA = 'ATRASADA',
}

export enum PrioridadeOP {
  BAIXA = 'BAIXA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA',
  URGENTE = 'URGENTE',
}

export enum OrigemOP {
  PEDIDO_VENDA = 'PEDIDO_VENDA',
  REPOSICAO_ESTOQUE = 'REPOSICAO_ESTOQUE',
  PLANO_MESTRE_PRODUCAO = 'PLANO_MESTRE_PRODUCAO',
  DEMANDA_INTERNA = 'DEMANDA_INTERNA',
  PREVISAO_VENDAS = 'PREVISAO_VENDAS',
}

export class OrdemProducao {
  id: number;
  codigo: string;
  produto: string;
  descricao?: string | null;
  quantidadePlanejada: number;
  quantidadeProduzida: number;
  status: StatusOP;
  prioridade: PrioridadeOP;
  dataFimReal?: string | null;
  dataInicioReal?: string | null;
  dataInicioPlanejado?: string | null;
  dataFimPlanejado?: string | null;
  setorId: number;
  responsavelId?: number | null;
  origemTipo?: OrigemOP | null;
  origemId?: string | null;
  observacoes?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  constructor(data?: Partial<OrdemProducao>) {
    if (data) {
      Object.assign(this, data);
      this.status = data.status || StatusOP.RASCUNHO;
      this.prioridade = data.prioridade || PrioridadeOP.MEDIA;
      this.quantidadeProduzida = data.quantidadeProduzida || 0;
      this.origemTipo = data.origemTipo || OrigemOP.PEDIDO_VENDA;
    }
  }

  isPending(): boolean {
    return this.status === StatusOP.RASCUNHO;
  }

  isInProgress(): boolean {
    return this.status === StatusOP.EM_ANDAMENTO;
  }

  isCompleted(): boolean {
    return this.status === StatusOP.FINALIZADA;
  }

  isCancelled(): boolean {
    return this.status === StatusOP.CANCELADA;
  }

  isPaused(): boolean {
    return this.status === StatusOP.PAUSADA;
  }

  canStart(): boolean {
    return this.isPending() || this.isPaused();
  }

  canComplete(): boolean {
    return (
      this.isInProgress() &&
      this.quantidadeProduzida >= this.quantidadePlanejada
    );
  }

  canPause(): boolean {
    return this.isInProgress();
  }

  canCancel(): boolean {
    return !this.isCompleted() && !this.isCancelled();
  }

  getProgressPercentage(): number {
    if (this.quantidadePlanejada === 0) return 0;
    return Math.min(
      (this.quantidadeProduzida / this.quantidadePlanejada) * 100,
      100,
    );
  }

  getRemainingQuantity(): number {
    return Math.max(this.quantidadePlanejada - this.quantidadeProduzida, 0);
  }

  isOverdue(): boolean {
    if (!this.dataFimPlanejado || this.isCompleted() || this.isCancelled()) {
      return false;
    }
    return new Date() > new Date(this.dataFimPlanejado);
  }

  startProduction(): void {
    if (this.canStart()) {
      this.status = StatusOP.EM_ANDAMENTO;
      this.dataInicioReal = new Date().toISOString();
      this.updatedAt = new Date();
    }
  }

  completeProduction(): void {
    if (this.canComplete()) {
      this.status = StatusOP.FINALIZADA;
      this.dataFimReal = new Date().toISOString();
      this.updatedAt = new Date();
    }
  }

  pauseProduction(): void {
    if (this.canPause()) {
      this.status = StatusOP.PAUSADA;
      this.updatedAt = new Date();
    }
  }

  cancelProduction(): void {
    if (this.canCancel()) {
      this.status = StatusOP.CANCELADA;
      this.updatedAt = new Date();
    }
  }
}
