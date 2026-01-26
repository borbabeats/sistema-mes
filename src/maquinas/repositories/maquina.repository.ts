import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Maquina } from '../entities/maquina.entity';
import { Manutencao } from '../entities/manutencao.entity';
import { IMaquinaRepository } from '../interfaces/maquina.repository.interface';

@Injectable()
export class MaquinaRepository extends IMaquinaRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: Partial<Maquina>): Promise<Maquina> {
    const { id, createdAt, updatedAt, deletedAt, setor, apontamentos, manutencoes, setorId, ...createData } = data;
    
    const maquina = await this.prisma.maquina.create({
      data: createData as any,
      include: {
        setor: true,
        apontamentos: true,
        manutencoes: true,
      },
    });

    return this.mapToEntity(maquina);
  }

  async findAll(filter?: any): Promise<Maquina[]> {
    const whereClause: any = {
      deleted_at: null,
    };

    if (filter?.status) {
      whereClause.status = filter.status as any;
    }

    if (filter?.setorId) {
      whereClause.setor_id = filter.setorId;
    }

    const maquinas = await this.prisma.maquina.findMany({
      where: whereClause,
      include: {
        setor: true,
      },
    });

    return maquinas.map(maquina => this.mapToEntity(maquina));
  }

  async findOne(id: number): Promise<Maquina | null> {
    const maquina = await this.prisma.maquina.findFirst({
      where: {
        id,
        deleted_at: null,
      },
      include: {
        setor: true,
      },
    });

    return maquina ? this.mapToEntity(maquina) : null;
  }

  async findByCodigo(codigo: string): Promise<Maquina | null> {
    const maquina = await this.prisma.maquina.findFirst({
      where: { codigo },
      include: {
        setor: true,
        apontamentos: true,
        manutencoes: true,
      },
    });

    return maquina ? this.mapToEntity(maquina) : null;
  }

  async findByStatus(status: string): Promise<Maquina[]> {
    const maquinas = await this.prisma.maquina.findMany({
      where: {
        status: status as any,
        deleted_at: null,
      },
      include: {
        setor: true,
      },
    });

    return maquinas.map(maquina => this.mapToEntity(maquina));
  }

  async update(id: number, data: Partial<Maquina>): Promise<Maquina> {
    const { id: _, createdAt, updatedAt, deletedAt, setor, apontamentos, manutencoes, setorId, ...updateData } = data;

    const maquina = await this.prisma.maquina.update({
      where: { id },
      data: updateData as any,
      include: {
        setor: true,
      },
    });

    return this.mapToEntity(maquina);
  }

  async remove(id: number): Promise<Maquina> {
    const maquina = await this.prisma.maquina.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
      include: {
        setor: true,
      },
    });

    return this.mapToEntity(maquina);
  }

  async findDeleted(): Promise<Maquina[]> {
    const maquinas = await this.prisma.maquina.findMany({
      where: {
        deleted_at: {
          not: null,
        },
      },
      include: {
        setor: true,
      },
    });

    return maquinas.map(maquina => this.mapToEntity(maquina));
  }

  async restore(id: number): Promise<Maquina> {
    const maquina = await this.prisma.maquina.update({
      where: { id },
      data: {
        deleted_at: null,
      },
      include: {
        setor: true,
      },
    });

    return this.mapToEntity(maquina);
  }

  async updateHorasUso(id: number, horas: number): Promise<Maquina> {
    const maquina = await this.prisma.maquina.update({
      where: { id },
      data: {
        horasUso: horas,
      },
      include: {
        setor: true,
        apontamentos: true,
        manutencoes: true,
      },
    });

    return this.mapToEntity(maquina);
  }

  // Métodos para Manutenção
  async createManutencao(data: Partial<Manutencao>): Promise<Manutencao> {
    const { id, createdAt, updatedAt, maquina, ...createData } = data;
    
    const manutencao = await this.prisma.manutencao.create({
      data: createData as any,
      include: {
        maquina: true,
      },
    });

    return this.mapManutencaoToEntity(manutencao);
  }

  async findManutencoesByMaquina(maquinaId: number, status?: string): Promise<Manutencao[]> {
    const where: any = {
      maquinaId,
    };
    if (status) {
      where.status = status as any;
    }

    const manutencoes = await this.prisma.manutencao.findMany({
      where,
      include: {
        maquina: true,
        responsavel: true,
      },
      orderBy: {
        dataAgendada: 'desc',
      },
    });

    return manutencoes.map(manutencao => this.mapManutencaoToEntity(manutencao));
  }

  async findManutencaoById(id: number): Promise<Manutencao | null> {
    const manutencao = await this.prisma.manutencao.findFirst({
      where: { id },
      include: {
        maquina: true,
        responsavel: true,
        historico: {
          orderBy: { dataRegistro: 'desc' },
        },
      },
    });

    return manutencao ? this.mapManutencaoToEntity(manutencao) : null;
  }

  async findManutencoesAgendadas(): Promise<Manutencao[]> {
    const manutencoes = await this.prisma.manutencao.findMany({
      where: {
        status: 'AGENDADA',
      },
      include: {
        maquina: true,
      },
      orderBy: {
        dataAgendada: 'asc',
      },
    });

    return manutencoes.map(manutencao => this.mapManutencaoToEntity(manutencao));
  }

  async findManutencoesAtrasadas(): Promise<Manutencao[]> {
    const manutencoes = await this.prisma.manutencao.findMany({
      where: {
        status: 'AGENDADA',
        dataAgendada: {
          lt: new Date(),
        },
      },
      include: {
        maquina: true,
      },
      orderBy: {
        dataAgendada: 'asc',
      },
    });

    return manutencoes.map(manutencao => this.mapManutencaoToEntity(manutencao));
  }

  async updateManutencao(id: number, data: Partial<Manutencao>): Promise<Manutencao> {
    const { id: _, createdAt, updatedAt, maquina, ...updateData } = data;

    const manutencao = await this.prisma.manutencao.update({
      where: { id },
      data: updateData as any,
      include: {
        maquina: true,
      },
    });

    return this.mapManutencaoToEntity(manutencao);
  }

  async removeManutencao(id: number): Promise<Manutencao> {
    const manutencao = await this.prisma.manutencao.update({
      where: { id },
      data: { 
        responsavel: { disconnect: true },
      },
      include: {
        maquina: true,
      },
    });

    return this.mapManutencaoToEntity(manutencao);
  }

  // Métodos para Histórico de Manutenção
  async findHistoricoManutencao(manutencaoId: number): Promise<any[]> {
    return this.prisma.historicoManutencao.findMany({
      where: { manutencaoId },
      orderBy: { dataRegistro: 'desc' },
    });
  }

  async createHistoricoManutencao(data: Partial<any>): Promise<any> {
    return this.prisma.historicoManutencao.create({
      data: data as any,
    });
  }

  // Métodos para Apontamento
  async findApontamentosByPeriodo(maquinaId: number, periodoInicio: Date, periodoFim: Date): Promise<any[]> {
    return this.prisma.apontamento.findMany({
      where: {
        maquinaId,
        dataInicio: { gte: periodoInicio },
        dataFim: { lte: periodoFim },
      },
      select: {
        dataInicio: true,
        dataFim: true,
      },
    });
  }

  private mapToEntity(prismaMaquina: any): Maquina {
    return {
      id: prismaMaquina.id,
      codigo: prismaMaquina.codigo,
      nome: prismaMaquina.nome,
      descricao: prismaMaquina.descricao,
      fabricante: prismaMaquina.fabricante,
      modelo: prismaMaquina.modelo,
      numeroSerie: prismaMaquina.numeroSerie,
      anoFabricacao: prismaMaquina.anoFabricacao,
      capacidade: prismaMaquina.capacidade,
      status: prismaMaquina.status,
      horasUso: prismaMaquina.horasUso,
      setor: prismaMaquina.setor,
      setorId: prismaMaquina.setor_id,
      createdAt: prismaMaquina.createdAt,
      updatedAt: prismaMaquina.updatedAt,
      deletedAt: prismaMaquina.deletedAt,
      apontamentos: prismaMaquina.apontamentos,
      manutencoes: prismaMaquina.manutencoes,
    };
  }

  private mapManutencaoToEntity(prismaManutencao: any): Manutencao {
    return {
      id: prismaManutencao.id,
      tipo: prismaManutencao.tipo,
      descricao: prismaManutencao.descricao,
      dataAgendada: prismaManutencao.dataAgendada,
      dataInicio: prismaManutencao.dataInicio,
      dataFim: prismaManutencao.dataFim,
      status: prismaManutencao.status,
      custoEstimado: prismaManutencao.custoEstimado,
      custoReal: prismaManutencao.custoReal,
      responsavel: prismaManutencao.responsavel,
      responsavelId: prismaManutencao.responsavelId,
      observacoes: prismaManutencao.observacoes,
      maquinaId: prismaManutencao.maquinaId,
      maquina: prismaManutencao.maquina,
      createdAt: prismaManutencao.createdAt,
      updatedAt: prismaManutencao.updatedAt,
    };
  }
}
