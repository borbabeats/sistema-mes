import { Manutencao, CreateManutencaoData, UpdateManutencaoData, HistoricoManutencao, StatusManutencao } from '../entities/manutencao.entity';

export const MANUTENCOES_REPOSITORY_TOKEN = 'MANUTENCOES_REPOSITORY_TOKEN';

export interface IManutencoesRepository {
  // CRUD básico
  create(data: CreateManutencaoData): Promise<Manutencao>;
  findOne(id: number): Promise<Manutencao | null>;
  findAll(filters?: {
    maquinaId?: number;
    status?: StatusManutencao;
    responsavelId?: number;
    dataInicio?: Date;
    dataFim?: Date;
  }): Promise<Manutencao[]>;
  update(id: number, data: UpdateManutencaoData): Promise<Manutencao>;
  delete(id: number): Promise<void>;

  // Métodos específicos de manutenção
  findByMaquina(maquinaId: number): Promise<Manutencao[]>;
  findByStatus(status: StatusManutencao): Promise<Manutencao[]>;
  findAgendadas(): Promise<Manutencao[]>;
  findEmAndamento(): Promise<Manutencao[]>;
  findAtrasadas(): Promise<Manutencao[]>;

  // Histórico
  createHistorico(data: {
    manutencaoId: number;
    statusAnterior?: string;
    statusNovo: string;
    descricao: string;
  }): Promise<HistoricoManutencao>;
  
  findHistoricoByManutencao(manutencaoId: number): Promise<HistoricoManutencao[]>;
}
