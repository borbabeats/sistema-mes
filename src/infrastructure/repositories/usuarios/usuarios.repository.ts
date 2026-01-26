import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IUsuariosRepository, CreateUsuarioData, UpdateUsuarioData, UsuarioFilters } from '../../../domain/repositories/usuarios.repository.interface';
import { Usuario, Cargo } from '../../../domain/entities/usuario.entity';

@Injectable()
export class UsuariosRepository implements IUsuariosRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUsuarioData): Promise<Usuario> {
    const usuario = await this.prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        senha: data.senha,
        cargo: data.cargo || Cargo.OPERADOR,
        photo_profile: data.photoProfile,
        setor_id: data.setorId,
      },
    });

    return this.mapToEntity(usuario);
  }

  async findAll(filters?: UsuarioFilters): Promise<Usuario[]> {
    const whereClause: any = {};

    if (filters?.nome) whereClause.nome = { contains: filters.nome };
    if (filters?.email) whereClause.email = { contains: filters.email };
    if (filters?.cargo) whereClause.cargo = filters.cargo;
    if (filters?.setorId) whereClause.setor_id = filters.setorId;

    const usuarios = await this.prisma.usuario.findMany({
      where: whereClause,
      orderBy: {
        nome: 'asc',
      },
    });

    return usuarios.map((u) => this.mapToEntity(u));
  }

  async findOne(id: number): Promise<Usuario | null> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
    });

    return usuario ? this.mapToEntity(usuario) : null;
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email },
    });

    return usuario ? this.mapToEntity(usuario) : null;
  }

  async findByNome(nome: string): Promise<Usuario[]> {
    const usuarios = await this.prisma.usuario.findMany({
      where: {
        nome: {
          contains: nome,
        },
      },
      orderBy: {
        nome: 'asc',
      },
    });

    return usuarios.map((u) => this.mapToEntity(u));
  }

  async findByCargo(cargo: Cargo): Promise<Usuario[]> {
    const usuarios = await this.prisma.usuario.findMany({
      where: { cargo },
      orderBy: {
        nome: 'asc',
      },
    });

    return usuarios.map((u) => this.mapToEntity(u));
  }

  async findBySetor(setorId: number): Promise<Usuario[]> {
    const usuarios = await this.prisma.usuario.findMany({
      where: { setor_id: setorId },
      orderBy: {
        nome: 'asc',
      },
    });

    return usuarios.map((u) => this.mapToEntity(u));
  }

  async update(id: number, data: UpdateUsuarioData): Promise<Usuario> {
    const updateData: any = {};

    if (data.nome !== undefined) updateData.nome = data.nome;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.telefone !== undefined) updateData.telefone = data.telefone;
    if (data.senha !== undefined) updateData.senha = data.senha;
    if (data.cargo !== undefined) updateData.cargo = data.cargo;
    if (data.photoProfile !== undefined) updateData.photo_profile = data.photoProfile;
    if (data.setorId !== undefined) updateData.setor_id = data.setorId;

    const usuario = await this.prisma.usuario.update({
      where: { id },
      data: updateData,
    });

    return this.mapToEntity(usuario);
  }

  async remove(id: number): Promise<Usuario> {
    const usuario = await this.prisma.usuario.delete({
      where: { id },
    });

    return this.mapToEntity(usuario);
  }

  async updateSenha(id: number, senha: string): Promise<Usuario> {
    const usuario = await this.prisma.usuario.update({
      where: { id },
      data: {
        senha,
      },
    });

    return this.mapToEntity(usuario);
  }

  private mapToEntity(prismaUsuario: any): Usuario {
    return new Usuario({
      id: prismaUsuario.id,
      nome: prismaUsuario.nome,
      email: prismaUsuario.email,
      telefone: prismaUsuario.telefone,
      senha: prismaUsuario.senha,
      cargo: prismaUsuario.cargo as Cargo,
      photoProfile: prismaUsuario.photo_profile,
      setorId: prismaUsuario.setor_id,
      createdAt: prismaUsuario.created_at,
      updatedAt: prismaUsuario.updated_at,
      deletedAt: prismaUsuario.deleted_at,
    });
  }
}
