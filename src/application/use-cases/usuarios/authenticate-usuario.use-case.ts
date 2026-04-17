import { Injectable, Inject } from '@nestjs/common';
import { IUsuariosRepository } from '../../../domain/repositories/usuarios.repository.interface';
import { Usuario, Cargo } from '../../../domain/entities/usuario.entity';
import { USUARIOS_REPOSITORY_TOKEN } from '../../../modules/users/constants';
import * as bcrypt from 'bcrypt';

export interface AuthenticateUsuarioData {
  email: string;
  senha: string;
}

export interface UsuarioResponse {
  id: number;
  nome: string;
  email?: string;
  telefone?: string;
  cargo: Cargo;
  photoProfile?: string;
  setorId?: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface AuthenticateUsuarioResult {
  usuario: UsuarioResponse;
  token: string;
}

@Injectable()
export class AuthenticateUsuarioUseCase {
  constructor(
    @Inject(USUARIOS_REPOSITORY_TOKEN) private readonly usuariosRepository: IUsuariosRepository,
  ) {}

  async execute(data: AuthenticateUsuarioData): Promise<AuthenticateUsuarioResult> {
    // Validar dados de entrada
    if (!data.email || !data.senha) {
      throw new Error('Email e senha são obrigatórios');
    }

    // Buscar usuário pelo email
    const usuario = await this.usuariosRepository.findByEmail(data.email);
    if (!usuario) {
      throw new Error('Credenciais inválidas');
    }

    // Verificar se o usuário está ativo
    if (usuario.deletedAt) {
      throw new Error('Usuário inativo');
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(data.senha, usuario.senha || '');
    if (!senhaValida) {
      throw new Error('Credenciais inválidas');
    }

    // Remover senha do retorno
    const usuarioResponse: UsuarioResponse = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      cargo: usuario.cargo,
      photoProfile: usuario.photoProfile,
      setorId: usuario.setorId,
      createdAt: usuario.createdAt,
      updatedAt: usuario.updatedAt,
      deletedAt: usuario.deletedAt,
    };

    // Gerar token (simplificado - em produção use JWT)
    const token = this.generateToken(usuario);

    return {
      usuario: usuarioResponse,
      token,
    };
  }

  private generateToken(usuario: Usuario): string {
    // Em produção, use JWT com assinatura adequada
    // Por enquanto, um token simples para exemplo
    const payload = {
      id: usuario.id,
      email: usuario.email,
      cargo: usuario.cargo,
    };

    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }
}
