import { Usuario } from '../entities/user.entity';

export abstract class IUserRepository {
  abstract create(data: Partial<Usuario>): Promise<Usuario>;
  abstract findAll(): Promise<Usuario[]>;
  abstract findOne(id: number): Promise<Usuario | null>;
  abstract findByEmail(email: string): Promise<Usuario | null>;
  abstract update(id: number, data: Partial<Usuario>): Promise<Usuario>;
  abstract remove(id: number): Promise<Usuario>;
}
