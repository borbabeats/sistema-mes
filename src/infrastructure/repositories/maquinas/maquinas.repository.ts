import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  IMaquinasRepository,
  CreateMaquinaData,
  UpdateMaquinaData,
  MaquinaFilters,
} from '../../../domain/repositories/maquinas.repository.interface';
import {
  Maquina,
  StatusMaquina,
} from '../../../domain/entities/maquina.entity';

@Injectable()
export class MaquinasRepository implements IMaquinasRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateMaquinaData): Promise<Maquina> {
    const maquina = await this.prisma.maquina.create({
      data: {
        codigo: data.codigo,
        nome: data.nome,
        descricao: data.descricao,
        fabricante: data.fabricante,
        modelo: data.modelo,
        numeroSerie: data.numeroSerie,
        anoFabricacao: data.anoFabricacao,
        capacidade: data.capacidade,
        status: data.status || StatusMaquina.DISPONIVEL,
        horasUso: 0,
        setor_id: data.setorId,
      },
    });

    return this.mapToEntity(maquina);
  }

  async findAll(filters?: MaquinaFilters): Promise<Maquina[]> {
    const whereClause: any = {};

    if (filters?.codigo)
      whereClause.codigo = { contains: filters.codigo, mode: 'insensitive' };
    if (filters?.nome)
      whereClause.nome = { contains: filters.nome, mode: 'insensitive' };
    if (filters?.status) whereClause.status = filters.status;
    if (filters?.setorId) whereClause.setor_id = filters.setorId;
    if (filters?.fabricante)
      whereClause.fabricante = {
        contains: filters.fabricante,
        mode: 'insensitive',
      };

    const maquinas = await this.prisma.maquina.findMany({
      where: whereClause,
      include: {
        setor: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
      orderBy: {
        nome: 'asc',
      },
    });

    return maquinas.map((m) => this.mapToEntityWithSetor(m));
  }

  async findOne(id: number): Promise<Maquina | null> {
    const maquina = await this.prisma.maquina.findUnique({
      where: { id },
      include: {
        setor: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    });

    return maquina ? this.mapToEntityWithSetor(maquina) : null;
  }

  async findByCodigo(codigo: string): Promise<Maquina | null> {
    const maquina = await this.prisma.maquina.findUnique({
      where: { codigo },
    });

    return maquina ? this.mapToEntity(maquina) : null;
  }

  async findBySetor(setorId: number): Promise<Maquina[]> {
    const maquinas = await this.prisma.maquina.findMany({
      where: { setor_id: setorId },
      orderBy: {
        nome: 'asc',
      },
    });

    return maquinas.map((m) => this.mapToEntity(m));
  }

  async findByStatus(status: StatusMaquina): Promise<Maquina[]> {
    const maquinas = await this.prisma.maquina.findMany({
      where: { status },
      orderBy: {
        nome: 'asc',
      },
    });

    return maquinas.map((m) => this.mapToEntity(m));
  }

  async findAvailable(): Promise<Maquina[]> {
    const maquinas = await this.prisma.maquina.findMany({
      where: { status: StatusMaquina.DISPONIVEL },
      orderBy: {
        nome: 'asc',
      },
    });

    return maquinas.map((m) => this.mapToEntity(m));
  }

  async update(id: number, data: UpdateMaquinaData): Promise<Maquina> {
    const updateData: any = {};

    if (data.codigo !== undefined) updateData.codigo = data.codigo;
    if (data.nome !== undefined) updateData.nome = data.nome;
    if (data.descricao !== undefined) updateData.descricao = data.descricao;
    if (data.fabricante !== undefined) updateData.fabricante = data.fabricante;
    if (data.modelo !== undefined) updateData.modelo = data.modelo;
    if (data.numeroSerie !== undefined)
      updateData.numeroSerie = data.numeroSerie;
    if (data.anoFabricacao !== undefined)
      updateData.anoFabricacao = data.anoFabricacao;
    if (data.capacidade !== undefined) updateData.capacidade = data.capacidade;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.setorId !== undefined) updateData.setor_id = data.setorId;

    const maquina = await this.prisma.maquina.update({
      where: { id },
      data: updateData,
    });

    return this.mapToEntity(maquina);
  }

  async remove(id: number): Promise<Maquina> {
    const maquina = await this.prisma.maquina.delete({
      where: { id },
    });

    return this.mapToEntity(maquina);
  }

  async updateHorasUso(id: number, horasAdicionais: number): Promise<Maquina> {
    const maquina = await this.prisma.maquina.update({
      where: { id },
      data: {
        horasUso: {
          increment: horasAdicionais,
        },
      },
    });

    return this.mapToEntity(maquina);
  }

  private mapToEntity(prismaMaquina: any): Maquina {
    return new Maquina({
      id: prismaMaquina.id,
      codigo: prismaMaquina.codigo,
      nome: prismaMaquina.nome,
      descricao: prismaMaquina.descricao,
      fabricante: prismaMaquina.fabricante,
      modelo: prismaMaquina.modelo,
      numeroSerie: prismaMaquina.numeroSerie,
      anoFabricacao: prismaMaquina.anoFabricacao,
      capacidade: prismaMaquina.capacidade,
      status: prismaMaquina.status as StatusMaquina,
      horasUso: prismaMaquina.horasUso,
      setorId: prismaMaquina.setor_id,
      createdAt: prismaMaquina.created_at,
      updatedAt: prismaMaquina.updated_at,
      deletedAt: prismaMaquina.deleted_at,
    });
  }

  private mapToEntityWithSetor(prismaMaquina: any): Maquina {
    const maquina = this.mapToEntity(prismaMaquina);
    if (prismaMaquina.setor) {
      (maquina as any).setor = prismaMaquina.setor;
    }
    return maquina;
  }
}
