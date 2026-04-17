export enum TipoManutencao {
  PREVENTIVA = 'PREVENTIVA',
  CORRETIVA = 'CORRETIVA',
  PREDITIVA = 'PREDITIVA',
  LUBRIFICACAO = 'LUBRIFICACAO',
  CALIBRACAO = 'CALIBRACAO',
  OUTRA = 'OUTRA'
}

export enum StatusManutencao {
  AGENDADA = 'AGENDADA',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDA = 'CONCLUIDA',
  CANCELADA = 'CANCELADA',
  ATRASADA = 'ATRASADA'
}

export interface Manutencao {
  id: number;
  maquinaId: number;
  tipo: TipoManutencao;
  descricao: string;
  dataAgendada: Date;
  dataInicio?: Date;
  dataFim?: Date;
  status: StatusManutencao;
  custoEstimado?: number;
  custoReal?: number;
  responsavelId?: number;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
  maquina?: any;
  responsavel?: any;
}

export interface CreateManutencaoData {
  maquinaId: number;
  tipo: TipoManutencao;
  descricao: string;
  dataAgendada: Date;
  custoEstimado?: number;
  responsavelId?: number;
  observacoes?: string;
}

export interface UpdateManutencaoData {
  tipo?: TipoManutencao;
  descricao?: string;
  dataAgendada?: Date;
  dataInicio?: Date;
  dataFim?: Date;
  status?: StatusManutencao;
  custoEstimado?: number;
  custoReal?: number;
  responsavelId?: number;
  observacoes?: string;
}

export interface HistoricoManutencao {
  id: number;
  manutencaoId: number;
  statusAnterior?: string;
  statusNovo: string;
  descricao: string;
  dataRegistro: Date;
}
