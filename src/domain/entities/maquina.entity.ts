export enum StatusMaquina {
  DISPONIVEL = 'DISPONIVEL',
  EM_USO = 'EM_USO',
  MANUTENCAO = 'MANUTENCAO',
  INATIVA = 'INATIVA',
  PARADA = 'PARADA',
  DESATIVADA = 'DESATIVADA',
}

export enum TipoManutencao {
  PREVENTIVA = 'PREVENTIVA',
  CORRETIVA = 'CORRETIVA',
  PREDITIVA = 'PREDITIVA',
  LUBRIFICACAO = 'LUBRIFICACAO',
  CALIBRACAO = 'CALIBRACAO',
  OUTRA = 'OUTRA',
}

export enum StatusManutencao {
  AGENDADA = 'AGENDADA',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDA = 'CONCLUIDA',
  CANCELADA = 'CANCELADA',
  ATRASADA = 'ATRASADA',
}

export class Maquina {
  id: number;
  codigo: string;
  nome: string;
  descricao?: string;
  fabricante?: string;
  modelo?: string;
  numeroSerie?: string;
  anoFabricacao?: number;
  capacidade?: string;
  status: StatusMaquina;
  horasUso: number;
  setorId?: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(data?: Partial<Maquina>) {
    if (data) {
      Object.assign(this, data);
      this.status = data.status || StatusMaquina.DISPONIVEL;
      this.horasUso = data.horasUso || 0;
    }
  }

  isAvailable(): boolean {
    return this.status === StatusMaquina.DISPONIVEL;
  }

  isInUse(): boolean {
    return this.status === StatusMaquina.EM_USO;
  }

  isUnderMaintenance(): boolean {
    return this.status === StatusMaquina.MANUTENCAO;
  }

  isActive(): boolean {
    return this.status !== StatusMaquina.INATIVA && this.status !== StatusMaquina.DESATIVADA;
  }

  canStartProduction(): boolean {
    return this.isAvailable() && this.isActive();
  }
}
