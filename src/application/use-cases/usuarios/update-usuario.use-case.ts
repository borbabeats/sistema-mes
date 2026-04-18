import { Injectable, Inject } from '@nestjs/common';
import { IUsuariosRepository } from '../../../domain/repositories/usuarios.repository.interface';
import { UpdateUsuarioData } from '../../../domain/repositories/usuarios.repository.interface';
import { Usuario, Cargo } from '../../../domain/entities/usuario.entity';
import { USUARIOS_REPOSITORY_TOKEN } from '../../../modules/users/constants';
import { FindSetorUseCase } from '../setores/find-setor.use-case';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UpdateUsuarioUseCase {
  constructor(
    @Inject(USUARIOS_REPOSITORY_TOKEN)
    private readonly usuariosRepository: IUsuariosRepository,
    private readonly findSetorUseCase: FindSetorUseCase,
  ) {}

  async execute(id: number, data: UpdateUsuarioData): Promise<Usuario> {
    // Verificar se o usuário existe
    const usuario = await this.usuariosRepository.findOne(id);
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    // Verificar se o email já existe (se fornecido e for diferente)
    if (data.email && data.email !== usuario.email) {
      const existingUsuario = await this.usuariosRepository.findByEmail(
        data.email,
      );
      if (existingUsuario) {
        throw new Error('Já existe um usuário com este email');
      }
    }

    // Validar setor (se fornecido)
    if (data.setorId) {
      const setor = await this.findSetorUseCase.execute(data.setorId);
      if (!setor) {
        throw new Error('Setor não encontrado');
      }
    }

    // Hash da senha (se fornecida)
    const updateData: Partial<Usuario> = { ...data };
    if (data.senha) {
      updateData.senha = await this.hashPassword(data.senha);
    }

    // Validar nome (se fornecido)
    if (data.nome && data.nome.trim().length < 3) {
      throw new Error('Nome deve ter pelo menos 3 caracteres');
    }

    // Validar cargo (se fornecido)
    if (data.cargo && !Object.values(Cargo).includes(data.cargo)) {
      throw new Error('Cargo inválido');
    }

    return this.usuariosRepository.update(id, updateData);
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }
}
