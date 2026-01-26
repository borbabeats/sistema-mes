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

    return setores.map((s) => this.mapToEntity(s));
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
}
