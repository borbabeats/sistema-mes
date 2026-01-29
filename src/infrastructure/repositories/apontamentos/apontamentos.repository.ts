import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IApontamentosRepository, CreateApontamentoData, UpdateApontamentoData, ApontamentoFilters } from '../../../domain/repositories/apontamentos.repository.interface';
import { Apontamento } from '../../../domain/entities/apontamento.entity';
import { PaginatedResult } from '../../../presentation/dto/common/pagination.dto';

@Injectable()
export class ApontamentosRepository implements IApontamentosRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateApontamentoData): Promise<Apontamento> {
    const apontamento = await this.prisma.apontamento.create({
      data: {
        opId: data.opId,
        maquinaId: data.maquinaId,
        usuarioId: data.usuarioId,
        quantidadeProduzida: data.quantidadeProduzida ?? 0,
        quantidadeDefeito: data.quantidadeDefeito ?? 0,
        dataInicio: data.dataInicio,
        dataFim: data.dataFim,
      },
    });

    return this.mapToEntity(apontamento);
  }

  async findAll(filters?: ApontamentoFilters): Promise<Apontamento[]> {
    const whereClause: any = {};

    if (filters?.opId) whereClause.opId = filters.opId;
    if (filters?.maquinaId) whereClause.maquinaId = filters.maquinaId;
    if (filters?.usuarioId) whereClause.usuarioId = filters.usuarioId;

    // Filtro por status da Ordem de Produção
    if (filters?.status) {
      whereClause.op = {
        status: filters.status,
      };
    }

    // Filtro por setor (através da Ordem de Produção)
    if (filters?.setorId) {
      whereClause.op = {
        ...whereClause.op,
        setorId: filters.setorId,
      };
    }

    // Filtro por ativo (apontamentos em andamento - sem dataFim)
    if (filters?.ativo !== undefined) {
      if (filters.ativo) {
        whereClause.dataFim = null;
      } else {
        whereClause.dataFim = { not: null };
      }
    }

    if (filters?.dataInicio || filters?.dataFim) {
      whereClause.AND = whereClause.AND || [];
      if (filters?.dataInicio) {
        whereClause.AND.push({
          dataInicio: { gte: filters.dataInicio },
        });
      }
      if (filters?.dataFim) {
        whereClause.AND.push({
          dataInicio: { lte: filters.dataFim },
        });
      }
    }

    const apontamentos = await this.prisma.apontamento.findMany({
      where: whereClause,
      include: {
        op: {
          include: {
            setor: true,
          },
        },
        maquina: true,
        usuario: true,
      },
      orderBy: {
        dataInicio: 'desc',
      },
    });

    return apontamentos.map((a) => this.mapToEntity(a));
  }

  async findAllPaginated(filters?: ApontamentoFilters, page: number = 1, limit: number = 10): Promise<PaginatedResult<Apontamento>> {
    const whereClause: any = {};

    if (filters?.opId) whereClause.opId = filters.opId;
    if (filters?.maquinaId) whereClause.maquinaId = filters.maquinaId;
    if (filters?.usuarioId) whereClause.usuarioId = filters.usuarioId;

    // Filtro por status da Ordem de Produção
    if (filters?.status) {
      whereClause.op = {
        status: filters.status,
      };
    }

    // Filtro por setor (através da Ordem de Produção)
    if (filters?.setorId) {
      whereClause.op = {
        ...whereClause.op,
        setorId: filters.setorId,
      };
    }

    // Filtro por ativo (apontamentos em andamento - sem dataFim)
    if (filters?.ativo !== undefined) {
      if (filters.ativo) {
        whereClause.dataFim = null;
      } else {
        whereClause.dataFim = { not: null };
      }
    }

    // Filtro de busca
    if (filters?.search) {
      const searchTerm = `%${filters.search}%`;
      
      if (filters?.searchField) {
        // Busca em campo específico
        switch (filters.searchField) {
          case 'op.codigo':
            whereClause.op = { ...whereClause.op, codigo: { contains: searchTerm } };
            break;
          case 'maquina.nome':
            whereClause.maquina = { nome: { contains: searchTerm } };
            break;
          case 'usuario.nome':
            whereClause.usuario = { nome: { contains: searchTerm } };
            break;
          case 'op.produto':
            whereClause.op = { ...whereClause.op, produto: { contains: searchTerm } };
            break;
          default:
            // Se campo não reconhecido, busca em todos os campos
            whereClause.OR = [
              { op: { codigo: { contains: searchTerm } } },
              { maquina: { nome: { contains: searchTerm } } },
              { usuario: { nome: { contains: searchTerm } } },
              { op: { produto: { contains: searchTerm } } },
            ];
        }
      } else {
        // Busca em múltiplos campos (padrão)
        whereClause.OR = [
          { op: { codigo: { contains: searchTerm } } },
          { maquina: { nome: { contains: searchTerm } } },
          { usuario: { nome: { contains: searchTerm } } },
          { op: { produto: { contains: searchTerm } } },
        ];
      }
    }

    if (filters?.dataInicio || filters?.dataFim) {
      whereClause.AND = whereClause.AND || [];
      if (filters?.dataInicio) {
        whereClause.AND.push({
          dataInicio: { gte: filters.dataInicio },
        });
      }
      if (filters?.dataFim) {
        whereClause.AND.push({
          dataInicio: { lte: filters.dataFim },
        });
      }
    }

    const skip = (page - 1) * limit;

    const [apontamentos, total] = await Promise.all([
      this.prisma.apontamento.findMany({
        where: whereClause,
        include: {
          op: {
            include: {
              setor: true,
            },
          },
          maquina: true,
          usuario: true,
        },
        orderBy: {
          dataInicio: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.apontamento.count({ where: whereClause }),
    ]);

    return {
      data: apontamentos.map((a) => this.mapToEntity(a)),
      total,
    };
  }

  async findOne(id: number): Promise<Apontamento | null> {
    const apontamento = await this.prisma.apontamento.findUnique({
      where: { id },
    });

    return apontamento ? this.mapToEntity(apontamento) : null;
  }

  async findByMaquina(maquinaId: number): Promise<Apontamento[]> {
    const apontamentos = await this.prisma.apontamento.findMany({
      where: { maquinaId },
      orderBy: {
        dataInicio: 'desc',
      },
    });

    return apontamentos.map((a) => this.mapToEntity(a));
  }

  async findByUsuario(usuarioId: number): Promise<Apontamento[]> {
    const apontamentos = await this.prisma.apontamento.findMany({
      where: { usuarioId },
      orderBy: {
        dataInicio: 'desc',
      },
    });

    return apontamentos.map((a) => this.mapToEntity(a));
  }

  async findByOrdemProducao(opId: number): Promise<Apontamento[]> {
    const apontamentos = await this.prisma.apontamento.findMany({
      where: { opId },
      orderBy: {
        dataInicio: 'desc',
      },
    });

    return apontamentos.map((a) => this.mapToEntity(a));
  }

  async findByPeriodo(dataInicio: Date, dataFim: Date): Promise<Apontamento[]> {
    const apontamentos = await this.prisma.apontamento.findMany({
      where: {
        AND: [
          { dataInicio: { gte: dataInicio } },
          {
            OR: [
              { dataFim: { lte: dataFim } },
              { dataFim: null },
            ],
          },
        ],
      },
      orderBy: {
        dataInicio: 'desc',
      },
    });

    return apontamentos.map((a) => this.mapToEntity(a));
  }

  async update(id: number, data: UpdateApontamentoData): Promise<Apontamento> {
    const updateData: any = {};

    if (data.opId !== undefined) updateData.opId = data.opId;
    if (data.maquinaId !== undefined) updateData.maquinaId = data.maquinaId;
    if (data.usuarioId !== undefined) updateData.usuarioId = data.usuarioId;
    if (data.quantidadeProduzida !== undefined) updateData.quantidadeProduzida = data.quantidadeProduzida;
    if (data.quantidadeDefeito !== undefined) updateData.quantidadeDefeito = data.quantidadeDefeito;
    if (data.dataInicio !== undefined) updateData.dataInicio = data.dataInicio;
    if (data.dataFim !== undefined) updateData.dataFim = data.dataFim;

    const apontamento = await this.prisma.apontamento.update({
      where: { id },
      data: updateData,
    });

    return this.mapToEntity(apontamento);
  }

  async remove(id: number): Promise<Apontamento> {
    const apontamento = await this.prisma.apontamento.delete({
      where: { id },
    });

    return this.mapToEntity(apontamento);
  }

  private mapToEntity(prismaApontamento: any): Apontamento {
    return new Apontamento({
      id: prismaApontamento.id,
      opId: prismaApontamento.opId,
      maquinaId: prismaApontamento.maquinaId,
      usuarioId: prismaApontamento.usuarioId,
      quantidadeProduzida: prismaApontamento.quantidadeProduzida,
      quantidadeDefeito: prismaApontamento.quantidadeDefeito,
      dataInicio: prismaApontamento.dataInicio,
      dataFim: prismaApontamento.dataFim,
      // Dados relacionados
      maquina: prismaApontamento.maquina ? {
        id: prismaApontamento.maquina.id,
        nome: prismaApontamento.maquina.nome,
        codigo: prismaApontamento.maquina.codigo,
        setor: prismaApontamento.maquina.setor ? {
          id: prismaApontamento.maquina.setor.id,
          nome: prismaApontamento.maquina.setor.nome,
        } : undefined,
      } : undefined,
      usuario: prismaApontamento.usuario ? {
        id: prismaApontamento.usuario.id,
        nome: prismaApontamento.usuario.nome,
        email: prismaApontamento.usuario.email,
      } : undefined,
      op: prismaApontamento.op ? {
        id: prismaApontamento.op.id,
        codigo: prismaApontamento.op.codigo,
        produto: prismaApontamento.op.produto,
        status: prismaApontamento.op.status,
      } : undefined,
    });
  }
}
