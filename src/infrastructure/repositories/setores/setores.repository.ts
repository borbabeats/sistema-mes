import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ISetoresRepository, CreateSetorData, UpdateSetorData, SetorFilters } from '../../../domain/repositories/setores.repository.interface';
import { Setor } from '../../../domain/entities/setor.entity';

@Injectable()
export class SetoresRepository implements ISetoresRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSetorData): Promise<Setor> {
    const setor = await this.prisma.setor.create({
      data: {
        nome: data.nome,
      },
    });

    return this.mapToEntity(setor);
  }

  async findAll(filters?: SetorFilters): Promise<Setor[]> {
    const whereClause: any = {};

    if (filters?.nome) whereClause.nome = { contains: filters.nome, mode: 'insensitive' };

    const setores = await this.prisma.setor.findMany({
      where: whereClause,
      orderBy: {
        nome: 'asc',
      },
    });

    // Para cada setor, buscar usuários e máquinas completos
    const setoresWithDetails = await Promise.all(
      setores.map(async (setor) => {
        const [usuarios, maquinas] = await Promise.all([
          this.prisma.usuario.findMany({
            where: { setor_id: setor.id, deleted_at: null },
            select: {
              id: true,
              nome: true,
              email: true,
              telefone: true,
              cargo: true,
              turno: true,
              photo_profile: true,
              setor_id: true,
              created_at: true,
              updated_at: true,
              deleted_at: true
            },
            orderBy: { nome: 'asc' }
          }),
          this.prisma.maquina.findMany({
            where: { setor_id: setor.id },
            orderBy: { codigo: 'asc' }
          })
        ]);

        return this.mapToEntityWithDetails(setor, usuarios, maquinas);
      })
    );

    return setoresWithDetails;
  }

  async findOne(id: number): Promise<Setor | null> {
    const setor = await this.prisma.setor.findUnique({
      where: { id },
    });

    return setor ? this.mapToEntity(setor) : null;
  }

  async findByNome(nome: string): Promise<Setor | null> {
    const setor = await this.prisma.setor.findUnique({
      where: { nome },
    });

    return setor ? this.mapToEntity(setor) : null;
  }

  async update(id: number, data: UpdateSetorData): Promise<Setor> {
    const updateData: any = {};

    if (data.nome !== undefined) updateData.nome = data.nome;

    const setor = await this.prisma.setor.update({
      where: { id },
      data: updateData,
    });

    return this.mapToEntity(setor);
  }

  async remove(id: number): Promise<Setor> {
    const setor = await this.prisma.setor.delete({
      where: { id },
    });

    return this.mapToEntity(setor);
  }

  private mapToEntity(prismaSetor: any): Setor {
    return new Setor({
      id: prismaSetor.id,
      nome: prismaSetor.nome,
      created_at: prismaSetor.created_at,
      updated_at: prismaSetor.updated_at,
      deleted_at: prismaSetor.deleted_at,
    });
  }

  private mapToEntityWithCounts(prismaSetor: any, qtdUsuarios: number, qtdMaquinas: number): Setor {
    return new Setor({
      id: prismaSetor.id,
      nome: prismaSetor.nome,
      qtdUsuarios,
      qtdMaquinas,
      created_at: prismaSetor.created_at,
      updated_at: prismaSetor.updated_at,
      deleted_at: prismaSetor.deleted_at,
    });
  }

  private mapToEntityWithDetails(prismaSetor: any, usuarios: any[], maquinas: any[]): Setor {
    // Mapear usuários para o formato esperado
    const usuariosFormatados = usuarios.map(usuario => ({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      cargo: usuario.cargo,
      turno: usuario.turno,
      photoProfile: usuario.photo_profile,
      setorId: usuario.setor_id,
      createdAt: usuario.created_at,
      updatedAt: usuario.updated_at,
      deletedAt: usuario.deleted_at
    }));

    return new Setor({
      id: prismaSetor.id,
      nome: prismaSetor.nome,
      qtdUsuarios: usuarios.length,
      qtdMaquinas: maquinas.length,
      created_at: prismaSetor.created_at,
      updated_at: prismaSetor.updated_at,
      deleted_at: prismaSetor.deleted_at,
      usuarios: usuariosFormatados,
      maquinas: maquinas
    });
  }
}
