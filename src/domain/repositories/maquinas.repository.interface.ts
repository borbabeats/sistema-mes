import { Maquina, StatusMaquina } from '../entities/maquina.entity';

export const MAQUINAS_REPOSITORY_TOKEN = 'MAQUINAS_REPOSITORY';

export interface IMaquinasRepository {
  create(data: CreateMaquinaData): Promise<Maquina>;
  findAll(filters?: MaquinaFilters): Promise<Maquina[]>;
  findOne(id: number): Promise<Maquina | null>;
  findByCodigo(codigo: string): Promise<Maquina | null>;
  findBySetor(setorId: number): Promise<Maquina[]>;
  findByStatus(status: StatusMaquina): Promise<Maquina[]>;
  findAvailable(): Promise<Maquina[]>;
  update(id: number, data: UpdateMaquinaData): Promise<Maquina>;
  remove(id: number): Promise<Maquina>;
  updateHorasUso(id: number, horasAdicionais: number): Promise<Maquina>;
}

export interface CreateMaquinaData {
  codigo: string;
  nome: string;
  descricao?: string;
  fabricante?: string;
  modelo?: string;
  numeroSerie?: string;
  anoFabricacao?: number;
  capacidade?: string;
  status?: StatusMaquina;
  setorId?: number;
}

export interface UpdateMaquinaData {
  codigo?: string;
  nome?: string;
  descricao?: string;
  fabricante?: string;
  modelo?: string;
  numeroSerie?: string;
  anoFabricacao?: number;
  capacidade?: string;
  status?: StatusMaquina;
  setorId?: number;
}

export interface MaquinaFilters {
  codigo?: string;
  nome?: string;
  status?: StatusMaquina;
  setorId?: number;
  fabricante?: string;
}
