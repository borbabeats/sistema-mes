import { Maquina } from '../entities/maquina.entity';
import { Manutencao } from '../entities/manutencao.entity';
import { HistoricoManutencao } from '../entities/historico-manutencao.entity';

export abstract class IMaquinaRepository {
  // Métodos para Máquina
  abstract create(data: Partial<Maquina>): Promise<Maquina>;
  abstract findAll(filter?: any): Promise<Maquina[]>;
  abstract findOne(id: number): Promise<Maquina | null>;
  abstract findByCodigo(codigo: string): Promise<Maquina | null>;
  abstract findByStatus(status: string): Promise<Maquina[]>;
  abstract update(id: number, data: Partial<Maquina>): Promise<Maquina>;
  abstract remove(id: number): Promise<Maquina>;
  abstract findDeleted(): Promise<Maquina[]>;
  abstract restore(id: number): Promise<Maquina>;
  abstract updateHorasUso(id: number, horas: number): Promise<Maquina>;
  
  // Métodos para Manutenção
  abstract createManutencao(data: Partial<Manutencao>): Promise<Manutencao>;
  abstract findManutencoesByMaquina(maquinaId: number, status?: string): Promise<Manutencao[]>;
  abstract findManutencaoById(id: number): Promise<Manutencao | null>;
  abstract findManutencoesAgendadas(): Promise<Manutencao[]>;
  abstract findManutencoesAtrasadas(): Promise<Manutencao[]>;
  abstract updateManutencao(id: number, data: Partial<Manutencao>): Promise<Manutencao>;
  abstract removeManutencao(id: number): Promise<Manutencao>;
  
  // Métodos para Histórico de Manutenção
  abstract findHistoricoManutencao(manutencaoId: number): Promise<HistoricoManutencao[]>;
  abstract createHistoricoManutencao(data: Partial<HistoricoManutencao>): Promise<HistoricoManutencao>;
  
  // Métodos para Apontamento
  abstract findApontamentosByPeriodo(maquinaId: number, periodoInicio: Date, periodoFim: Date): Promise<any[]>;
}
