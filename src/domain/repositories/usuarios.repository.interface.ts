import { Usuario, Cargo } from '../entities/usuario.entity';

export interface IUsuariosRepository {
  create(data: CreateUsuarioData): Promise<Usuario>;
  findAll(filters?: UsuarioFilters): Promise<Usuario[]>;
  findOne(id: number): Promise<Usuario | null>;
  findByEmail(email: string): Promise<Usuario | null>;
  findByNome(nome: string): Promise<Usuario[]>;
  findByCargo(cargo: Cargo): Promise<Usuario[]>;
  findBySetor(setorId: number): Promise<Usuario[]>;
  update(id: number, data: UpdateUsuarioData): Promise<Usuario>;
  remove(id: number): Promise<Usuario>;
  updateSenha(id: number, senha: string): Promise<Usuario>;
}

export interface CreateUsuarioData {
  nome: string;
  email?: string;
  telefone?: string;
  senha: string;
  cargo?: Cargo;
  turno?: string;
  photoProfile?: string;
  setorId?: number;
}

export interface UpdateUsuarioData {
  nome?: string;
  email?: string;
  telefone?: string;
  senha?: string;
  cargo?: Cargo;
  turno?: string;
  photoProfile?: string;
  setorId?: number;
}

export interface UsuarioFilters {
  nome?: string;
  email?: string;
  cargo?: Cargo;
  turno?: string;
  setorId?: number;
}
