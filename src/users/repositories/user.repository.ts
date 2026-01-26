import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Usuario } from '../entities/user.entity';
import { IUserRepository } from '../interfaces/user.repository.interface';

@Injectable()
export class UserRepository extends IUserRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: Partial<Usuario>): Promise<Usuario> {
    const { id, created_at, updated_at, deleted_at, setor, ...createData } = data;
    
    const user = await this.prisma.usuario.create({
      data: createData as any,
      include: {
        setor: true,
      },
    });

    return this.mapToEntity(user);
  }

  async findAll(): Promise<Usuario[]> {
    const users = await this.prisma.usuario.findMany({
      where: {
        deleted_at: null,
      },
      include: {
        setor: true,
      },
    });

    return users.map(user => this.mapToEntity(user));
  }

  async findOne(id: number): Promise<Usuario | null> {
    const user = await this.prisma.usuario.findFirst({
      where: { 
        AND: [
          { id },
          { deleted_at: null },
        ],
       },
      include: {
        setor: true,
      },
    });

    return user ? this.mapToEntity(user) : null;
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const user = await this.prisma.usuario.findFirst({
      where: { email, deleted_at: null },
      include: {
        setor: true,
      },
    });

    return user ? this.mapToEntity(user) : null;
  }

  async update(id: number, data: Partial<Usuario>): Promise<Usuario> {
    const updateData: any = { 
      ...data,
      updated_at: new Date(),
    };

    const user = await this.prisma.usuario.update({
      where: { id, deleted_at: null },
      data: updateData,
      include: {
        setor: true,
      },
    });

    return this.mapToEntity(user);
  }

  async remove(id: number): Promise<Usuario> {
    const user = await this.prisma.usuario.update({
      where: { id, deleted_at: null },
      data: {
        deleted_at: new Date(),
      },
      include: {
        setor: true,
      },
    });

    return this.mapToEntity(user);
  }

  private mapToEntity(prismaUser: any): Usuario {
    return {
      id: prismaUser.id,
      nome: prismaUser.nome,
      email: prismaUser.email,
      telefone: prismaUser.telefone,
      senha: prismaUser.senha,
      cargo: prismaUser.cargo,
      photo_profile: prismaUser.photo_profile,
      setor_id: prismaUser.setor_id,
      setor: prismaUser.setor,
      created_at: prismaUser.created_at,
      updated_at: prismaUser.updated_at,
      deleted_at: prismaUser.deleted_at,
    };
  }
}
