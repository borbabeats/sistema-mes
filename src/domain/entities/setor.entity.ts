export class Setor {
  id: number;
  nome: string;
  qtdUsuarios?: number;
  qtdMaquinas?: number;
  usuarios?: any[];
  maquinas?: any[];
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;

  constructor(data?: Partial<Setor>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  isActive(): boolean {
    return !this.deleted_at;
  }

  updateNome(nome: string): void {
    this.nome = nome;
    this.updated_at = new Date();
  }

  softDelete(): void {
    this.deleted_at = new Date();
    this.updated_at = new Date();
  }
}
