export enum Cargo {
  ADMIN = 'ADMIN',
  GERENTE = 'GERENTE',
  OPERADOR = 'OPERADOR',
}


export class Usuario {
  id: number;
  nome: string;
  email?: string;
  telefone?: string;
  senha: string;
  cargo: Cargo;
  turno?: string;
  photoProfile?: string;
  setorId?: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(data?: Partial<Usuario>) {
    if (data) {
      Object.assign(this, data);
      this.cargo = data.cargo || Cargo.OPERADOR;
    }
  }

  isAdmin(): boolean {
    return this.cargo === Cargo.ADMIN;
  }

  isGerente(): boolean {
    return this.cargo === Cargo.GERENTE;
  }

  isOperador(): boolean {
    return this.cargo === Cargo.OPERADOR;
  }

  canManageUsers(): boolean {
    return this.isAdmin() || this.isGerente();
  }

  canManageProduction(): boolean {
    return this.isAdmin() || this.isGerente() || this.isOperador();
  }

  canManageSystem(): boolean {
    return this.isAdmin();
  }
}
