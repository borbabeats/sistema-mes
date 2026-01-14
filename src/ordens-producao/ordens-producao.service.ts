import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrdemProducaoDto } from './dto/create-ordem-producao.dto';
import { UpdateOrdemProducaoDto } from './dto/update-ordem-producao.dto';
import { FilterOrdemProducaoDto } from './dto/filter-ordem-producao.dto';
import { OrdemProducao } from './entities/ordem-producao-entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdensProducaoService {
  constructor(private prisma: PrismaService) {}

  async create(createOrdemProducaoDto: CreateOrdemProducaoDto): Promise<OrdemProducao> {
    const { operadoresIds, dataInicio, dataFim, ...data } = createOrdemProducaoDto;

    // Verificar se o setor existe
    const setorExists = await this.prisma.setor.findUnique({
      where: { id: data.setorId, deleted_at: null },
    });
    if (!setorExists) {
      throw new NotFoundException(`Setor com ID ${data.setorId} não encontrado`);
    }

    // Verificar se o responsável existe, se fornecido
    if (data.responsavelId) {
      const responsavelExists = await this.prisma.usuario.findUnique({
        where: { id: data.responsavelId, deleted_at: null },
      });
      if (!responsavelExists) {
        throw new NotFoundException(`Usuário responsável com ID ${data.responsavelId} não encontrado`);
      }
    }

    // Verificar se os operadores existem, se fornecidos
    if (operadoresIds && operadoresIds.length > 0) {
      const operadoresCount = await this.prisma.usuario.count({
        where: {
          id: { in: operadoresIds },
          deleted_at: null,
        },
      });
      if (operadoresCount !== operadoresIds.length) {
        throw new NotFoundException('Um ou mais operadores não foram encontrados');
      }
    }

    const ordemProducao = await this.prisma.$transaction(async (prisma) => {
      const ordem = await prisma.ordemProducao.create({
        data: {
          ...data,
          status: 'PLANEJADA', // Define o status inicial como PLANEJADA
          dataInicioPlanejado: dataInicio ? new Date(dataInicio) : null,
          dataFimPlanejado: dataFim ? new Date(dataFim) : null,
          operadores: operadoresIds?.length
            ? {
                connect: operadoresIds.map((id) => ({ id })),
              }
            : undefined,
        },
        include: {
          setor: true,
          responsavel: true,
          operadores: true,
        },
      });

      return new OrdemProducao(ordem);
    });

    return ordemProducao;
  }

  async findAll(filters?: FilterOrdemProducaoDto): Promise<OrdemProducao[]> {
    const { search, status, prioridade, setorId, responsavelId, dataInicio, dataFim, ...rest } = filters || {};

    const where: Prisma.OrdemProducaoWhereInput = {
      deletedAt: null,
      ...(search && {
        OR: [
          { codigo: { contains: search, mode: 'insensitive' as const } },
          { produto: { contains: search, mode: 'insensitive' as const } },
          { descricao: search ? { contains: search, mode: 'insensitive' as const } : undefined },
        ].filter(Boolean) as Prisma.OrdemProducaoWhereInput[],
      }),
      ...(status && { status }),
      ...(prioridade && { prioridade }),
      ...(setorId && { setorId }),
      ...(responsavelId && { responsavelId }),
      ...((dataInicio || dataFim) && {
        AND: [
          dataInicio ? { dataInicioPlanejado: { gte: new Date(dataInicio) } } : undefined,
          dataFim ? { dataFimPlanejado: { lte: new Date(dataFim) } } : undefined,
        ].filter(Boolean) as Prisma.OrdemProducaoWhereInput[],
      }),
    };

    const ordens = await this.prisma.ordemProducao.findMany({
      where,
      include: {
        setor: true,
        responsavel: true,
        operadores: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return ordens.map((ordem) => new OrdemProducao(ordem));
  }

  async findOne(id: number): Promise<OrdemProducao> {
    const ordem = await this.prisma.ordemProducao.findUnique({
      where: { id, deletedAt: null },
      include: {
        setor: true,
        responsavel: true,
        operadores: true,
        apontamentos: {
          include: {
            maquina: true,
            usuario: true,
          },
          orderBy: {
            dataInicio: 'desc',
          },
        },
      },
    });

    if (!ordem) {
      throw new NotFoundException(`Ordem de produção com ID ${id} não encontrada`);
    }

    return new OrdemProducao(ordem);
  }

  async update(
    id: number,
    updateOrdemProducaoDto: UpdateOrdemProducaoDto,
  ): Promise<OrdemProducao> {
    const { operadoresIds, dataInicio, dataFim, ...data } = updateOrdemProducaoDto;

    // Verificar se a ordem de produção existe
    const ordemExistente = await this.prisma.ordemProducao.findUnique({
      where: { id, deletedAt: null },
    });

    if (!ordemExistente) {
      throw new NotFoundException(`Ordem de produção com ID ${id} não encontrada`);
    }

    // Verificar se o setor existe, se for atualizado
    if (data.setorId) {
      const setorExists = await this.prisma.setor.findUnique({
        where: { id: data.setorId, deleted_at: null },
      });
      if (!setorExists) {
        throw new NotFoundException(`Setor com ID ${data.setorId} não encontrado`);
      }
    }

    // Verificar se o responsável existe, se fornecido
    if (data.responsavelId) {
      const responsavelExists = await this.prisma.usuario.findUnique({
        where: { id: data.responsavelId, deleted_at: null },
      });
      if (!responsavelExists) {
        throw new NotFoundException(`Usuário responsável com ID ${data.responsavelId} não encontrado`);
      }
    }

    // Verificar se os operadores existem, se fornecidos
    if (operadoresIds && operadoresIds.length > 0) {
      const operadoresCount = await this.prisma.usuario.count({
        where: {
          id: { in: operadoresIds },
          deleted_at: null,
        },
      });
      if (operadoresCount !== operadoresIds.length) {
        throw new NotFoundException('Um ou mais operadores não foram encontrados');
      }
    }

    // Atualizar a ordem de produção
    const ordemAtualizada = await this.prisma.$transaction(async (prisma) => {
      // Se for mudar o status para EM_ANDAMENTO e ainda não tiver data de início real
      if (data.status === 'EM_ANDAMENTO' && !ordemExistente.dataInicioReal) {
        data.dataInicioReal = new Date();
      }

      // Se for mudar o status para FINALIZADA
      if (data.status === 'FINALIZADA') {
        data.dataFimReal = new Date();
      }

      const updateData: any = { 
        ...data,
        // Atualiza as datas de planejamento se fornecidas
        ...(dataInicio && { dataInicioPlanejado: new Date(dataInicio) }),
        ...(dataFim && { dataFimPlanejado: new Date(dataFim) }),
      };

      // Se houver operadores para atualizar
      if (operadoresIds) {
        updateData.operadores = {
          set: operadoresIds.map((id) => ({ id })),
        };
      }

      const ordem = await prisma.ordemProducao.update({
        where: { id },
        data: updateData,
        include: {
          setor: true,
          responsavel: true,
          operadores: true,
        },
      });

      return new OrdemProducao(ordem);
    });

    return ordemAtualizada;
  }

  async remove(id: number): Promise<{ message: string; id: number; codigo: string }> {
    // Verificar se a ordem de produção existe
    const ordemExistente = await this.prisma.ordemProducao.findUnique({
      where: { id, deletedAt: null },
    });

    if (!ordemExistente) {
      throw new NotFoundException(`Ordem de produção com ID ${id} não encontrada`);
    }

    // Soft delete
    await this.prisma.ordemProducao.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
    return {
      message: 'Ordem de produção removida com sucesso',
      id,
      codigo: ordemExistente.codigo,
    };
  }

  async iniciarProducao(id: number): Promise<OrdemProducao> {
    const ordem = await this.prisma.ordemProducao.findUnique({
      where: { id, deletedAt: null },
    });

    if (!ordem) {
      throw new NotFoundException(`Ordem de produção com ID ${id} não encontrada`);
    }

    if (ordem.status === 'FINALIZADA' || ordem.status === 'CANCELADA') {
      throw new BadRequestException(
        `Não é possível iniciar uma ordem de produção com status ${ordem.status}`,
      );
    }

    const ordemAtualizada = await this.prisma.ordemProducao.update({
      where: { id },
      data: {
        status: 'EM_ANDAMENTO',
        dataInicioReal: new Date(),
      },
      include: {
        setor: true,
        responsavel: true,
        operadores: true,
      },
    });

    return new OrdemProducao(ordemAtualizada);
  }

  async pausarProducao(id: number): Promise<OrdemProducao> {
    const ordem = await this.prisma.ordemProducao.findUnique({
      where: { id, deletedAt: null },
    });

    if (!ordem) {
      throw new NotFoundException(`Ordem de produção com ID ${id} não encontrada`);
    }

    if (ordem.status !== 'EM_ANDAMENTO') {
      throw new BadRequestException(
        `Só é possível pausar uma ordem de produção que está em andamento. Status atual: ${ordem.status}`,
      );
    }

    const ordemAtualizada = await this.prisma.ordemProducao.update({
      where: { id },
      data: {
        status: 'PAUSADA',
      },
      include: {
        setor: true,
        responsavel: true,
        operadores: true,
      },
    });

    return new OrdemProducao(ordemAtualizada);
  }

  async retomarProducao(id: number): Promise<OrdemProducao> {
    const ordem = await this.prisma.ordemProducao.findUnique({
      where: { id, deletedAt: null },
    });

    if (!ordem) {
      throw new NotFoundException(`Ordem de produção com ID ${id} não encontrada`);
    }

    if (ordem.status !== 'PAUSADA') {
      throw new BadRequestException(
        `Só é possível retomar uma ordem de produção que está pausada. Status atual: ${ordem.status}`,
      );
    }

    const ordemAtualizada = await this.prisma.ordemProducao.update({
      where: { id },
      data: {
        status: 'EM_ANDAMENTO',
      },
      include: {
        setor: true,
        responsavel: true,
        operadores: true,
      },
    });

    return new OrdemProducao(ordemAtualizada);
  }

  async finalizarProducao(id: number): Promise<OrdemProducao> {
    const ordem = await this.prisma.ordemProducao.findUnique({
      where: { id, deletedAt: null },
    });

    if (!ordem) {
      throw new NotFoundException(`Ordem de produção com ID ${id} não encontrada`);
    }

    if (ordem.status === 'FINALIZADA' || ordem.status === 'CANCELADA') {
      throw new BadRequestException(
        `Não é possível finalizar uma ordem de produção com status ${ordem.status}`,
      );
    }

    const ordemAtualizada = await this.prisma.ordemProducao.update({
      where: { id },
      data: {
        status: 'FINALIZADA',
        dataFimReal: new Date(),
      },
      include: {
        setor: true,
        responsavel: true,
        operadores: true,
      },
    });

    return new OrdemProducao(ordemAtualizada);
  }

  async cancelarProducao(id: number, motivo: string): Promise<OrdemProducao> {
    const ordem = await this.prisma.ordemProducao.findUnique({
      where: { id, deletedAt: null },
    });

    if (!ordem) {
      throw new NotFoundException(`Ordem de produção com ID ${id} não encontrada`);
    }

    if (ordem.status === 'FINALIZADA' || ordem.status === 'CANCELADA') {
      throw new BadRequestException(
        `Não é possível cancelar uma ordem de produção com status ${ordem.status}`,
      );
    }

    const ordemAtualizada = await this.prisma.ordemProducao.update({
      where: { id },
      data: {
        status: 'CANCELADA',
        observacoes: motivo
          ? `${ordem.observacoes || ''}\n\n---\n**CANCELADA EM**: ${new Date().toISOString()}\n**MOTIVO**: ${motivo}`
          : ordem.observacoes,
      },
      include: {
        setor: true,
        responsavel: true,
        operadores: true,
      },
    });

    return new OrdemProducao(ordemAtualizada);
  }

  async atualizarProducao(
    id: number,
    quantidadeProduzida: number,
    quantidadeDefeito: number = 0,
  ): Promise<OrdemProducao> {
    const ordem = await this.prisma.ordemProducao.findUnique({
      where: { id, deletedAt: null },
    });

    if (!ordem) {
      throw new NotFoundException(`Ordem de produção com ID ${id} não encontrada`);
    }

    if (ordem.status !== 'EM_ANDAMENTO') {
      throw new BadRequestException(
        `Só é possível atualizar a produção de uma ordem em andamento. Status atual: ${ordem.status}`,
      );
    }

    const novaQuantidade = (ordem.quantidadeProduzida || 0) + quantidadeProduzida;

    if (novaQuantidade > ordem.quantidadePlanejada) {
      throw new BadRequestException(
        `A quantidade produzida (${novaQuantidade}) não pode ser maior que a quantidade planejada (${ordem.quantidadePlanejada})`,
      );
    }

    const ordemAtualizada = await this.prisma.ordemProducao.update({
      where: { id },
      data: {
        quantidadeProduzida: novaQuantidade,
        // Se atingiu ou ultrapassou a quantidade planejada, finaliza automaticamente
        ...(novaQuantidade >= ordem.quantidadePlanejada
          ? {
              status: 'FINALIZADA',
              dataFimReal: new Date(),
            }
          : {}),
      },
      include: {
        setor: true,
        responsavel: true,
        operadores: true,
      },
    });

    return new OrdemProducao(ordemAtualizada);
  }
}