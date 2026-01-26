import { Setor } from '../entities/setor.entity';

export abstract class ISetorRepository {
  abstract create(data: Partial<Setor>): Promise<Setor>;
  abstract findAll(): Promise<Setor[]>;
  abstract findOne(id: number): Promise<Setor | null>;
  abstract findByName(nome: string): Promise<Setor | null>;
  abstract findByNameExcludingId(nome: string, id: number): Promise<Setor | null>;
  abstract update(id: number, data: Partial<Setor>): Promise<Setor>;
  abstract remove(id: number): Promise<Setor>;
  abstract findDeleted(): Promise<Setor[]>;
  abstract restore(id: number): Promise<Setor>;
}
