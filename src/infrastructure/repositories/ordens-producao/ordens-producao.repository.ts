import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IOrdensProducaoRepository, CreateOrdemProducaoData, UpdateOrdemProducaoData, OrdemProducaoFilters } from '../../../domain/repositories/ordens-producao.repository.interface';
import { OrdemProducao, StatusOP, PrioridadeOP, OrigemOP } from '../../../domain/entities/ordem-producao.entity';
import { PaginatedResult } from '../../../presentation/dto/common/pagination.dto';

@Injectable()
export class OrdensProducaoRepository implements IOrdensProducaoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateOrdemProducaoData): Promise<OrdemProducao> {
    const ordemProducao = await this.prisma.ordemProducao.create({
      data: {
        codigo: data.codigo,
        produto: data.produto,
        descricao: data.descricao,
        quantidadePlanejada: data.quantidadePlanejada,
        quantidadeProduzida: 0,
        status: StatusOP.RASCUNHO,
        prioridade: data.prioridade || PrioridadeOP.MEDIA,
        dataInicioPlanejado: data.dataInicioPlanejado,
        dataFimPlanejado: data.dataFimPlanejado,
        setorId: data.setorId,
        responsavelId: data.responsavelId,
        origemTipo: data.origemTipo || OrigemOP.PEDIDO_VENDA,
        origemId: data.origemId,
        observacoes: data.observacoes,
      },
    });

    return this.mapToEntity(ordemProducao);
  }

  async findAll(filters?: OrdemProducaoFilters): Promise<OrdemProducao[]> {
    const whereClause: any = {};

    if (filters?.codigo) whereClause.codigo = { contains: filters.codigo, mode: 'insensitive' };
    if (filters?.produto) whereClause.produto = { contains: filters.produto, mode: 'insensitive' };
    if (filters?.status) whereClause.status = filters.status;
    if (filters?.prioridade) whereClause.prioridade = filters.prioridade;
    if (filters?.origemTipo) whereClause.origemTipo = filters.origemTipo;
    if (filters?.setorId) whereClause.setorId = filters.setorId;
    if (filters?.responsavelId) whereClause.responsavelId = filters.responsavelId;

    if (filters?.dataInicio || filters?.dataFim) {
      whereClause.AND = [];
      if (filters?.dataInicio) {
        whereClause.AND.push({
          createdAt: { gte: filters.dataInicio },
        });
      }
      if (filters?.dataFim) {
        whereClause.AND.push({
          createdAt: { lte: filters.dataFim },
        });
      }
    }

    const ordensProducao = await this.prisma.ordemProducao.findMany({
      where: whereClause,
      orderBy: [
        { prioridade: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return ordensProducao.map((op) => this.mapToEntity(op));
  }

  async findAllPaginated(
    filters?: OrdemProducaoFilters,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResult<OrdemProducao>> {
    const whereClause: any = {};

    if (filters?.codigo) whereClause.codigo = { contains: filters.codigo, mode: 'insensitive' };
    if (filters?.produto) whereClause.produto = { contains: filters.produto, mode: 'insensitive' };
    if (filters?.status) whereClause.status = filters.status;
    if (filters?.prioridade) whereClause.prioridade = filters.prioridade;
    if (filters?.origemTipo) whereClause.origemTipo = filters.origemTipo;
    if (filters?.setorId) whereClause.setorId = filters.setorId;
    if (filters?.responsavelId) whereClause.responsavelId = filters.responsavelId;

    if (filters?.search) {
      const searchTerm = filters.search;

      if (filters?.searchField) {
        switch (filters.searchField) {
          case 'codigo':
            whereClause.codigo = { contains: searchTerm, mode: 'insensitive' };
            break;
          case 'produto':
            whereClause.produto = { contains: searchTerm, mode: 'insensitive' };
            break;
          case 'descricao':
            whereClause.descricao = { contains: searchTerm, mode: 'insensitive' };
            break;
          default:
            whereClause.OR = [
              { codigo: { contains: searchTerm, mode: 'insensitive' } },
              { produto: { contains: searchTerm, mode: 'insensitive' } },
              { descricao: { contains: searchTerm, mode: 'insensitive' } },
              { origemId: { contains: searchTerm, mode: 'insensitive' } },
            ];
        }
      } else {
        whereClause.OR = [
          { codigo: { contains: searchTerm, mode: 'insensitive' } },
          { produto: { contains: searchTerm, mode: 'insensitive' } },
          { descricao: { contains: searchTerm, mode: 'insensitive' } },
          { origemId: { contains: searchTerm, mode: 'insensitive' } },
        ];
      }
    }

    if (filters?.dataInicio || filters?.dataFim) {
      whereClause.AND = whereClause.AND || [];
      if (filters?.dataInicio) {
        whereClause.AND.push({
          createdAt: { gte: filters.dataInicio },
        });
      }
      if (filters?.dataFim) {
        whereClause.AND.push({
          createdAt: { lte: filters.dataFim },
        });
      }
    }

    let orderBy: any = [
      { prioridade: 'desc' },
      { createdAt: 'desc' },
    ];

    if (filters?.sortBy) {
      const validSortFields = [
        'id',
        'codigo',
        'produto',
        'status',
        'prioridade',
        'createdAt',
        'dataInicioPlanejado',
        'dataFimPlanejado',
        'dataInicioReal',
        'dataFimReal',
      ];

      if (validSortFields.includes(filters.sortBy)) {
        orderBy = { [filters.sortBy]: (filters.sortOrder || 'DESC').toLowerCase() };
      }
    }

    const skip = (page - 1) * limit;

    const [ordensProducao, total] = await Promise.all([
      this.prisma.ordemProducao.findMany({
        where: whereClause,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.ordemProducao.count({ where: whereClause }),
    ]);

    return {
      data: ordensProducao.map((op) => this.mapToEntity(op)),
      total,
    };
  }

  async findOne(id: number): Promise<OrdemProducao | null> {
    const ordemProducao = await this.prisma.ordemProducao.findUnique({
      where: { id },
    });

    return ordemProducao ? this.mapToEntity(ordemProducao) : null;
  }

  async findByCodigo(codigo: string): Promise<OrdemProducao | null> {
    const ordemProducao = await this.prisma.ordemProducao.findUnique({
      where: { codigo },
    });

    return ordemProducao ? this.mapToEntity(ordemProducao) : null;
  }

  async findByStatus(status: StatusOP): Promise<OrdemProducao[]> {
    const ordensProducao = await this.prisma.ordemProducao.findMany({
      where: { status },
      orderBy: [
        { prioridade: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return ordensProducao.map((op) => this.mapToEntity(op));
  }

  async findByPrioridade(prioridade: PrioridadeOP): Promise<OrdemProducao[]> {
    const ordensProducao = await this.prisma.ordemProducao.findMany({
      where: { prioridade },
      orderBy: [
        { createdAt: 'desc' },
      ],
    });

    return ordensProducao.map((op) => this.mapToEntity(op));
  }

  async findBySetor(setorId: number): Promise<OrdemProducao[]> {
    const ordensProducao = await this.prisma.ordemProducao.findMany({
      where: { setorId },
      orderBy: [
        { prioridade: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return ordensProducao.map((op) => this.mapToEntity(op));
  }

  async findByResponsavel(responsavelId: number): Promise<OrdemProducao[]> {
    const ordensProducao = await this.prisma.ordemProducao.findMany({
      where: { responsavelId },
      orderBy: [
        { prioridade: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return ordensProducao.map((op) => this.mapToEntity(op));
  }

  async findOverdue(): Promise<OrdemProducao[]> {
    const now = new Date();
    const ordensProducao = await this.prisma.ordemProducao.findMany({
      where: {
        status: {
          notIn: [StatusOP.FINALIZADA, StatusOP.CANCELADA],
        },
        dataFimPlanejado: {
          lt: now,
        },
      },
      orderBy: [
        { prioridade: 'desc' },
        { dataFimPlanejado: 'asc' },
      ],
    });

    return ordensProducao.map((op) => this.mapToEntity(op));
  }

  async findPending(): Promise<OrdemProducao[]> {
    const ordensProducao = await this.prisma.ordemProducao.findMany({
      where: { status: StatusOP.RASCUNHO },
      orderBy: [
        { prioridade: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return ordensProducao.map((op) => this.mapToEntity(op));
  }

  async update(id: number, data: UpdateOrdemProducaoData): Promise<OrdemProducao> {
    const updateData: any = {};

    if (data.codigo !== undefined) updateData.codigo = data.codigo;
    if (data.produto !== undefined) updateData.produto = data.produto;
    if (data.descricao !== undefined) updateData.descricao = data.descricao;
    if (data.quantidadePlanejada !== undefined) updateData.quantidadePlanejada = data.quantidadePlanejada;
    if (data.quantidadeProduzida !== undefined) updateData.quantidadeProduzida = data.quantidadeProduzida;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.prioridade !== undefined) updateData.prioridade = data.prioridade;
    if (data.dataFimReal !== undefined) updateData.dataFimReal = typeof data.dataFimReal === 'string' ? new Date(data.dataFimReal) : data.dataFimReal;
    if (data.dataInicioReal !== undefined) updateData.dataInicioReal = typeof data.dataInicioReal === 'string' ? new Date(data.dataInicioReal) : data.dataInicioReal;
    if (data.dataInicioPlanejado !== undefined) updateData.dataInicioPlanejado = typeof data.dataInicioPlanejado === 'string' ? new Date(data.dataInicioPlanejado) : data.dataInicioPlanejado;
    if (data.dataFimPlanejado !== undefined) updateData.dataFimPlanejado = typeof data.dataFimPlanejado === 'string' ? new Date(data.dataFimPlanejado) : data.dataFimPlanejado;
    if (data.setorId !== undefined) updateData.setorId = data.setorId;
    if (data.responsavelId !== undefined) updateData.responsavelId = data.responsavelId;
    if (data.origemTipo !== undefined) updateData.origemTipo = data.origemTipo;
    if (data.origemId !== undefined) updateData.origemId = data.origemId;
    if (data.observacoes !== undefined) updateData.observacoes = data.observacoes;

    const ordemProducao = await this.prisma.ordemProducao.update({
      where: { id },
      data: updateData,
    });

    return this.mapToEntity(ordemProducao);
  }

  async remove(id: number): Promise<OrdemProducao> {
    const ordemProducao = await this.prisma.ordemProducao.delete({
      where: { id },
    });

    return this.mapToEntity(ordemProducao);
  }

  async updateQuantidadeProduzida(id: number, quantidade: number): Promise<OrdemProducao> {
    const ordemProducao = await this.prisma.ordemProducao.update({
      where: { id },
      data: {
        quantidadeProduzida: quantidade,
      },
    });

    return this.mapToEntity(ordemProducao);
  }

  private mapToEntity(prismaOrdemProducao: any): OrdemProducao {
    return new OrdemProducao({
      id: prismaOrdemProducao.id,
      codigo: prismaOrdemProducao.codigo,
      produto: prismaOrdemProducao.produto,
      descricao: prismaOrdemProducao.descricao,
      quantidadePlanejada: prismaOrdemProducao.quantidadePlanejada,
      quantidadeProduzida: prismaOrdemProducao.quantidadeProduzida,
      status: prismaOrdemProducao.status as StatusOP,
      prioridade: prismaOrdemProducao.prioridade as PrioridadeOP,
      dataFimReal: prismaOrdemProducao.dataFimReal,
      dataInicioReal: prismaOrdemProducao.dataInicioReal,
      dataInicioPlanejado: prismaOrdemProducao.dataInicioPlanejado,
      dataFimPlanejado: prismaOrdemProducao.dataFimPlanejado,
      setorId: prismaOrdemProducao.setorId,
      responsavelId: prismaOrdemProducao.responsavelId,
      origemTipo: prismaOrdemProducao.origemTipo as OrigemOP,
      origemId: prismaOrdemProducao.origemId,
      observacoes: prismaOrdemProducao.observacoes,
      createdAt: prismaOrdemProducao.createdAt,
      updatedAt: prismaOrdemProducao.updatedAt,
      deletedAt: prismaOrdemProducao.deletedAt,
    });
  }
}
