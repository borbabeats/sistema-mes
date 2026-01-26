import { Injectable } from '@nestjs/common';
import { IUsuariosRepository, CreateUsuarioData } from '../../../domain/repositories/usuarios.repository.interface';
import { ISetoresRepository } from '../../../domain/repositories/setores.repository.interface';
import { Usuario, Cargo } from '../../../domain/entities/usuario.entity';

@Injectable()
export class CreateUsuarioUseCase {
  constructor(
    private readonly usuariosRepository: IUsuariosRepository,
    private readonly setoresRepository: ISetoresRepository,
  ) {}

  async execute(data: CreateUsuarioData): Promise<Usuario> {
    // Verificar se o email já existe (se fornecido)
    if (data.email) {
      const existingUsuario = await this.usuariosRepository.findByEmail(data.email);
      if (existingUsuario) {
        throw new Error('Já existe um usuário com este email');
      }
    }

    // Verificar se o setor existe (se fornecido)
    if (data.setorId) {
      const setor = await this.setoresRepository.findOne(data.setorId);
      if (!setor) {
        throw new Error('Setor não encontrado');
      }
    }

    // Validar nome
    if (!data.nome || data.nome.trim().length < 3) {
      throw new Error('Nome deve ter pelo menos 3 caracteres');
    }

    // Validar senha
    if (!data.senha || data.senha.length < 6) {
      throw new Error('Senha deve ter pelo menos 6 caracteres');
    }

    // Criar usuário
    const usuario = new Usuario({
      ...data,
      cargo: data.cargo || Cargo.OPERADOR,
    });

    return this.usuariosRepository.create(usuario);
  }
}
