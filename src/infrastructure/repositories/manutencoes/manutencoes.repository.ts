import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  IManutencoesRepository,
  MANUTENCOES_REPOSITORY_TOKEN,
} from '../../../domain/repositories/manutencoes.repository.interface';
import {
  Manutencao,
  CreateManutencaoData,
  UpdateManutencaoData,
  HistoricoManutencao,
  StatusManutencao,
} from '../../../domain/entities/manutencao.entity';

@Injectable()
export class ManutencoesRepository implements IManutencoesRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(manutencao: any): Manutencao {
    return {
      id: manutencao.id,
      maquinaId: manutencao.maquina_id,
      tipo: manutencao.tipo,
      descricao: manutencao.descricao,
      dataAgendada: manutencao.data_agendada,
      dataInicio: manutencao.data_inicio,
      dataFim: manutencao.data_fim,
      status: manutencao.status,
      custoEstimado: manutencao.custo_estimado
        ? Number(manutencao.custo_estimado)
        : undefined,
      custoReal: manutencao.custo_real
        ? Number(manutencao.custo_real)
        : undefined,
      responsavelId: manutencao.responsavel_id,
      observacoes: manutencao.observacoes,
      createdAt: manutencao.created_at,
      updatedAt: manutencao.updated_at,
      maquina: manutencao.maquina,
      responsavel: manutencao.responsavel
        ? {
            ...manutencao.responsavel,
            senha: undefined,
          }
        : undefined,
    };
  }

  private toHistoricoEntity(historico: any): HistoricoManutencao {
    return {
      id: historico.id,
      manutencaoId: historico.manutencao_id,
      statusAnterior: historico.status_anterior,
      statusNovo: historico.status_novo,
      descricao: historico.descricao,
      dataRegistro: historico.data_registro,
    };
  }

  async create(data: CreateManutencaoData): Promise<Manutencao> {
    const manutencao = await this.prisma.manutencao.create({
      data: {
        maquinaId: data.maquinaId,
        tipo: data.tipo,
        descricao: data.descricao,
        dataAgendada: data.dataAgendada,
        custoEstimado: data.custoEstimado,
        responsavelId: data.responsavelId,
        observacoes: data.observacoes,
        status: StatusManutencao.AGENDADA,
      },
      include: {
        maquina: true,
        responsavel: true,
      },
    });

    return this.toEntity(manutencao);
  }

  async findOne(id: number): Promise<Manutencao | null> {
    const manutencao = await this.prisma.manutencao.findUnique({
      where: { id },
      include: {
        maquina: true,
        responsavel: true,
      },
    });

    return manutencao ? this.toEntity(manutencao) : null;
  }

  async findAll(filters?: {
    maquinaId?: number;
    status?: StatusManutencao;
    responsavelId?: number;
    dataInicio?: Date;
    dataFim?: Date;
    page?: number;
    limit?: number;
  }): Promise<{ data: Manutencao[]; total: number }> {
    const where: any = {};

    if (filters?.maquinaId) {
      where.maquinaId = filters.maquinaId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.responsavelId) {
      where.responsavelId = filters.responsavelId;
    }

    if (filters?.dataInicio || filters?.dataFim) {
      where.dataAgendada = {};
      if (filters?.dataInicio) {
        where.dataAgendada.gte = filters.dataInicio;
      }
      if (filters?.dataFim) {
        where.dataAgendada.lte = filters.dataFim;
      }
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    const [manutencoes, total] = await this.prisma.$transaction([
      this.prisma.manutencao.findMany({
        where,
        include: {
          maquina: true,
          responsavel: true,
        },
        orderBy: {
          dataAgendada: 'asc',
        },
        skip,
        take: limit,
      }),
      this.prisma.manutencao.count({ where }),
    ]);

    return {
      data: manutencoes.map((m) => this.toEntity(m)),
      total,
    };
  }

  async update(id: number, data: UpdateManutencaoData): Promise<Manutencao> {
    const updateData: any = {};

    if (data.tipo) updateData.tipo = data.tipo;
    if (data.descricao) updateData.descricao = data.descricao;
    if (data.dataAgendada) updateData.dataAgendada = data.dataAgendada;
    if (data.dataInicio) updateData.dataInicio = data.dataInicio;
    if (data.dataFim) updateData.dataFim = data.dataFim;
    if (data.status) updateData.status = data.status;
    if (data.custoEstimado !== undefined)
      updateData.custoEstimado = data.custoEstimado;
    if (data.custoReal !== undefined) updateData.custoReal = data.custoReal;
    if (data.responsavelId !== undefined)
      updateData.responsavelId = data.responsavelId;
    if (data.observacoes !== undefined)
      updateData.observacoes = data.observacoes;

    const manutencao = await this.prisma.manutencao.update({
      where: { id },
      data: updateData,
      include: {
        maquina: true,
        responsavel: true,
      },
    });

    return this.toEntity(manutencao);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.manutencao.delete({
      where: { id },
    });
  }

  async findByMaquina(maquinaId: number): Promise<Manutencao[]> {
    const manutencoes = await this.prisma.manutencao.findMany({
      where: { maquinaId: maquinaId },
      include: {
        maquina: true,
        responsavel: true,
      },
      orderBy: {
        dataAgendada: 'desc',
      },
    });

    return manutencoes.map((m) => this.toEntity(m));
  }

  async findByStatus(status: StatusManutencao): Promise<Manutencao[]> {
    const manutencoes = await this.prisma.manutencao.findMany({
      where: { status },
      include: {
        maquina: true,
        responsavel: true,
      },
      orderBy: {
        dataAgendada: 'asc',
      },
    });

    return manutencoes.map((m) => this.toEntity(m));
  }

  async findAgendadas(): Promise<Manutencao[]> {
    return this.findByStatus(StatusManutencao.AGENDADA);
  }

  async findAgendadasPaginated(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Manutencao[]; total: number }> {
    const skip = (page - 1) * limit;

    const [manutencoes, total] = await this.prisma.$transaction([
      this.prisma.manutencao.findMany({
        where: { status: StatusManutencao.AGENDADA },
        include: {
          maquina: true,
          responsavel: true,
        },
        orderBy: {
          dataAgendada: 'asc',
        },
        skip,
        take: limit,
      }),
      this.prisma.manutencao.count({
        where: { status: StatusManutencao.AGENDADA },
      }),
    ]);

    return {
      data: manutencoes.map((m) => this.toEntity(m)),
      total,
    };
  }

  async findEmAndamento(): Promise<Manutencao[]> {
    return this.findByStatus(StatusManutencao.EM_ANDAMENTO);
  }

  async findEmAndamentoPaginated(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Manutencao[]; total: number }> {
    const skip = (page - 1) * limit;

    const [manutencoes, total] = await this.prisma.$transaction([
      this.prisma.manutencao.findMany({
        where: { status: StatusManutencao.EM_ANDAMENTO },
        include: {
          maquina: true,
          responsavel: true,
        },
        orderBy: {
          dataAgendada: 'asc',
        },
        skip,
        take: limit,
      }),
      this.prisma.manutencao.count({
        where: { status: StatusManutencao.EM_ANDAMENTO },
      }),
    ]);

    return {
      data: manutencoes.map((m) => this.toEntity(m)),
      total,
    };
  }

  async findAtrasadas(): Promise<Manutencao[]> {
    const manutencoes = await this.prisma.manutencao.findMany({
      where: {
        status: StatusManutencao.AGENDADA,
        dataAgendada: {
          lt: new Date(),
        },
      },
      include: {
        maquina: true,
        responsavel: true,
      },
      orderBy: {
        dataAgendada: 'asc',
      },
    });

    return manutencoes.map((m) => this.toEntity(m));
  }

  async findAtrasadasPaginated(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Manutencao[]; total: number }> {
    const skip = (page - 1) * limit;
    const where = {
      status: StatusManutencao.AGENDADA,
      dataAgendada: {
        lt: new Date(),
      },
    };

    const [manutencoes, total] = await this.prisma.$transaction([
      this.prisma.manutencao.findMany({
        where,
        include: {
          maquina: true,
          responsavel: true,
        },
        orderBy: {
          dataAgendada: 'asc',
        },
        skip,
        take: limit,
      }),
      this.prisma.manutencao.count({ where }),
    ]);

    return {
      data: manutencoes.map((m) => this.toEntity(m)),
      total,
    };
  }

  async createHistorico(data: {
    manutencaoId: number;
    statusAnterior?: string;
    statusNovo: string;
    descricao: string;
  }): Promise<HistoricoManutencao> {
    const historico = await this.prisma.historicoManutencao.create({
      data: {
        manutencaoId: data.manutencaoId,
        statusAnterior: data.statusAnterior,
        statusNovo: data.statusNovo,
        descricao: data.descricao,
      },
    });

    return this.toHistoricoEntity(historico);
  }

  async findHistoricoByManutencao(
    manutencaoId: number,
  ): Promise<HistoricoManutencao[]> {
    const historicos = await this.prisma.historicoManutencao.findMany({
      where: { manutencaoId: manutencaoId },
      orderBy: {
        dataRegistro: 'desc',
      },
    });

    return historicos.map((h) => this.toHistoricoEntity(h));
  }
}
