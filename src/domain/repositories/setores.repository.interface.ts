import { Setor } from '../entities/setor.entity';

export interface ISetoresRepository {
  create(data: CreateSetorData): Promise<Setor>;
  findAll(filters?: SetorFilters): Promise<Setor[]>;
  findOne(id: number): Promise<Setor | null>;
  findByNome(nome: string): Promise<Setor | null>;
  update(id: number, data: UpdateSetorData): Promise<Setor>;
  remove(id: number): Promise<Setor>;
}

export interface CreateSetorData {
  nome: string;
}

export interface UpdateSetorData {
  nome?: string;
}

export interface SetorFilters {
  nome?: string;
}
