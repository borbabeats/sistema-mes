export class Apontamento {
  id: number;
  opId: number;
  maquinaId: number;
  usuarioId: number;
  quantidadeProduzida: number;
  quantidadeDefeito: number;
  dataInicio: Date;
  dataFim?: Date | null;

  constructor(data?: Partial<Apontamento>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  isValid(): boolean {
    return !!(this.opId && this.maquinaId && this.usuarioId && this.dataInicio);
  }

  isCompleted(): boolean {
    return !!this.dataFim;
  }

  getDuration(): number | null {
    if (!this.dataFim) return null;
    return this.dataFim.getTime() - this.dataInicio.getTime();
  }
}
