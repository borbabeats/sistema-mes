export class Apontamento {
  id: number;
  opId: number;
  maquinaId: number;
  usuarioId: number;
  quantidadeProduzida: number;
  quantidadeDefeito: number;
  dataInicio: string;
  dataFim?: string | null;

  // Dados relacionados
  maquina?: {
    id: number;
    nome: string;
    codigo: string;
    setor?: {
      id: number;
      nome: string;
    };
  };
  usuario?: {
    id: number;
    nome: string;
    email?: string;
  };
  op?: {
    id: number;
    codigo: string;
    produto: string;
    status: string;
  };

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
    return (
      new Date(this.dataFim).getTime() - new Date(this.dataInicio).getTime()
    );
  }
}
