import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IOrdensProducaoRepository } from '../interfaces/ordens-producao.repository.interface';
import { OrdemProducao } from '../entities/ordem-producao-entity';
import { CreateOrdemProducaoDto } from '../dto/create-ordem-producao.dto';
import { UpdateOrdemProducaoDto } from '../dto/update-ordem-producao.dto';
import { FilterOrdemProducaoDto } from '../dto/filter-ordem-producao.dto';
import { Prisma } from '@prisma/client';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class OrdensProducaoRepository extends IOrdensProducaoRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {
    super();
  }

  async create(data: CreateOrdemProducaoDto): Promise<OrdemProducao> {
    this.logger.debug('Criando nova ordem de produção', { data }, 'OrdensProducaoRepository');
    
    const { operadoresIds, dataInicio, dataFim, ...createData } = data;

    try {
      const ordemProducao = await this.prisma.$transaction(async (prisma) => {
        const ordem = await prisma.ordemProducao.create({
          data: {
            ...createData,
            status: 'PLANEJADA',
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

        return this.mapToEntity(ordem);
      });

      this.logger.info('Ordem de produção criada com sucesso', { ordemId: ordemProducao.id }, 'OrdensProducaoRepository');
      return ordemProducao;
    } catch (error) {
      this.logger.errorWithMeta('Erro ao criar ordem de produção', error, { data }, 'OrdensProducaoRepository');
      throw error;
    }
  }

  async findAll(filters?: FilterOrdemProducaoDto): Promise<OrdemProducao[]> {
    this.logger.debug('Buscando ordens de produção', { filters }, 'OrdensProducaoRepository');
    
    const { search, status, prioridade, setorId, responsavelId, dataInicio, dataFim } = filters || {};

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

    try {
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

      this.logger.info('Ordens de produção encontradas', { count: ordens.length }, 'OrdensProducaoRepository');
      return ordens.map((ordem) => this.mapToEntity(ordem));
    } catch (error) {
      this.logger.errorWithMeta('Erro ao buscar ordens de produção', error, { filters }, 'OrdensProducaoRepository');
      throw error;
    }
  }

  async findOne(id: number): Promise<OrdemProducao | null> {
    this.logger.debug('Buscando ordem de produção por ID', { id }, 'OrdensProducaoRepository');
    
    try {
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

      if (ordem) {
        this.logger.debug('Ordem de produção encontrada', { id, status: ordem.status }, 'OrdensProducaoRepository');
      } else {
        this.logger.warn('Ordem de produção não encontrada', { id }, 'OrdensProducaoRepository');
      }

      return ordem ? this.mapToEntity(ordem) : null;
    } catch (error) {
      this.logger.errorWithMeta('Erro ao buscar ordem de produção por ID', error, { id }, 'OrdensProducaoRepository');
      throw error;
    }
  }

  async update(id: number, data: UpdateOrdemProducaoDto): Promise<OrdemProducao> {
    this.logger.debug('Atualizando ordem de produção', { id, data }, 'OrdensProducaoRepository');
    
    const { operadoresIds, dataInicio, dataFim, ...updateData } = data;

    try {
      const ordemAtualizada = await this.prisma.$transaction(async (prisma) => {
        // Se for mudar o status para EM_ANDAMENTO e ainda não tiver data de início real
        if (updateData.status === 'EM_ANDAMENTO' && updateData.dataInicioReal === undefined) {
          updateData.dataInicioReal = new Date();
        }

        // Se for mudar o status para FINALIZADA
        if (updateData.status === 'FINALIZADA' && updateData.dataFimReal === undefined) {
          updateData.dataFimReal = new Date();
        }

        const updateInput: any = {
          ...updateData,
          ...(dataInicio && { dataInicioPlanejado: new Date(dataInicio) }),
          ...(dataFim && { dataFimPlanejado: new Date(dataFim) }),
        };

        // Se houver operadores para atualizar
        if (operadoresIds) {
          updateInput.operadores = {
            set: operadoresIds.map((id) => ({ id })),
          };
        }

        const ordem = await prisma.ordemProducao.update({
          where: { id },
          data: updateInput,
          include: {
            setor: true,
            responsavel: true,
            operadores: true,
          },
        });

        return this.mapToEntity(ordem);
      });

      this.logger.info('Ordem de produção atualizada com sucesso', { id, novoStatus: ordemAtualizada.status }, 'OrdensProducaoRepository');
      return ordemAtualizada;
    } catch (error) {
      this.logger.errorWithMeta('Erro ao atualizar ordem de produção', error, { id, data }, 'OrdensProducaoRepository');
      throw error;
    }
  }

  async remove(id: number): Promise<OrdemProducao> {
    this.logger.debug('Removendo ordem de produção', { id }, 'OrdensProducaoRepository');
    
    try {
      const ordem = await this.prisma.ordemProducao.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
        include: {
          setor: true,
          responsavel: true,
          operadores: true,
        },
      });

      this.logger.info('Ordem de produção removida com sucesso', { id }, 'OrdensProducaoRepository');
      return this.mapToEntity(ordem);
    } catch (error) {
      this.logger.errorWithMeta('Erro ao remover ordem de produção', error, { id }, 'OrdensProducaoRepository');
      throw error;
    }
  }

  async iniciarProducao(id: number): Promise<OrdemProducao> {
    this.logger.info('Iniciando produção da ordem', { id }, 'OrdensProducaoRepository');
    
    try {
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

      this.logger.info('Produção iniciada com sucesso', { id }, 'OrdensProducaoRepository');
      return this.mapToEntity(ordemAtualizada);
    } catch (error) {
      this.logger.errorWithMeta('Erro ao iniciar produção', error, { id }, 'OrdensProducaoRepository');
      throw error;
    }
  }

  async pausarProducao(id: number): Promise<OrdemProducao> {
    this.logger.info('Pausando produção da ordem', { id }, 'OrdensProducaoRepository');
    
    try {
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

      this.logger.info('Produção pausada com sucesso', { id }, 'OrdensProducaoRepository');
      return this.mapToEntity(ordemAtualizada);
    } catch (error) {
      this.logger.errorWithMeta('Erro ao pausar produção', error, { id }, 'OrdensProducaoRepository');
      throw error;
    }
  }

  async retomarProducao(id: number): Promise<OrdemProducao> {
    this.logger.info('Retomando produção da ordem', { id }, 'OrdensProducaoRepository');
    
    try {
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

      this.logger.info('Produção retomada com sucesso', { id }, 'OrdensProducaoRepository');
      return this.mapToEntity(ordemAtualizada);
    } catch (error) {
      this.logger.errorWithMeta('Erro ao retomar produção', error, { id }, 'OrdensProducaoRepository');
      throw error;
    }
  }

  async finalizarProducao(id: number): Promise<OrdemProducao> {
    this.logger.info('Finalizando produção da ordem', { id }, 'OrdensProducaoRepository');
    
    try {
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

      this.logger.info('Produção finalizada com sucesso', { id }, 'OrdensProducaoRepository');
      return this.mapToEntity(ordemAtualizada);
    } catch (error) {
      this.logger.errorWithMeta('Erro ao finalizar produção', error, { id }, 'OrdensProducaoRepository');
      throw error;
    }
  }

  async cancelarProducao(id: number, motivo: string): Promise<OrdemProducao> {
    this.logger.warn('Cancelando produção da ordem', { id, motivo }, 'OrdensProducaoRepository');
    
    try {
      const ordemExistente = await this.prisma.ordemProducao.findUnique({
        where: { id },
      });

      const ordemAtualizada = await this.prisma.ordemProducao.update({
        where: { id },
        data: {
          status: 'CANCELADA',
          observacoes: motivo
            ? `${ordemExistente?.observacoes || ''}\n\n---\n**CANCELADA EM**: ${new Date().toISOString()}\n**MOTIVO**: ${motivo}`
            : ordemExistente?.observacoes,
        },
        include: {
          setor: true,
          responsavel: true,
          operadores: true,
        },
      });

      this.logger.warn('Produção cancelada com sucesso', { id, motivo }, 'OrdensProducaoRepository');
      return this.mapToEntity(ordemAtualizada);
    } catch (error) {
      this.logger.errorWithMeta('Erro ao cancelar produção', error, { id, motivo }, 'OrdensProducaoRepository');
      throw error;
    }
  }

  async atualizarProducao(
    id: number,
    quantidadeProduzida: number,
    quantidadeDefeito: number = 0,
  ): Promise<OrdemProducao> {
    this.logger.debug('Atualizando produção da ordem', { id, quantidadeProduzida, quantidadeDefeito }, 'OrdensProducaoRepository');
    
    try {
      const ordemExistente = await this.prisma.ordemProducao.findUnique({
        where: { id },
      });

      const novaQuantidade = (ordemExistente?.quantidadeProduzida || 0) + quantidadeProduzida;

      const ordemAtualizada = await this.prisma.ordemProducao.update({
        where: { id },
        data: {
          quantidadeProduzida: novaQuantidade,
          // Se atingiu ou ultrapassou a quantidade planejada, finaliza automaticamente
          ...(novaQuantidade >= ordemExistente!.quantidadePlanejada
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

      this.logger.info('Produção atualizada com sucesso', { 
        id, 
        quantidadeProduzida: novaQuantidade, 
        status: ordemAtualizada.status 
      }, 'OrdensProducaoRepository');
      
      return this.mapToEntity(ordemAtualizada);
    } catch (error) {
      this.logger.errorWithMeta('Erro ao atualizar produção', error, { id, quantidadeProduzida, quantidadeDefeito }, 'OrdensProducaoRepository');
      throw error;
    }
  }

  private mapToEntity(prismaOrdem: any): OrdemProducao {
    return {
      id: prismaOrdem.id,
      codigo: prismaOrdem.codigo,
      produto: prismaOrdem.produto,
      descricao: prismaOrdem.descricao,
      quantidadePlanejada: prismaOrdem.quantidadePlanejada,
      quantidadeProduzida: prismaOrdem.quantidadeProduzida,
      status: prismaOrdem.status,
      prioridade: prismaOrdem.prioridade,
      dataFimReal: prismaOrdem.dataFimReal,
      dataInicioReal: prismaOrdem.dataInicioReal,
      dataInicioPlanejado: prismaOrdem.dataInicioPlanejado,
      dataFimPlanejado: prismaOrdem.dataFimPlanejado,
      setorId: prismaOrdem.setorId,
      responsavelId: prismaOrdem.responsavelId,
      observacoes: prismaOrdem.observacoes,
      createdAt: prismaOrdem.createdAt,
      updatedAt: prismaOrdem.updatedAt,
      deletedAt: prismaOrdem.deletedAt,
      setor: prismaOrdem.setor,
      responsavel: prismaOrdem.responsavel,
      operadores: prismaOrdem.operadores,
    } as OrdemProducao;
  }
}
