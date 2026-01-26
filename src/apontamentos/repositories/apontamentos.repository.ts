import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IApontamentosRepository } from '../interfaces/apontamentos.repository.interface';
import { Apontamento } from '../entities/apontamento.entity';
import { CreateApontamentoDto } from '../dto/create-apontamento.dto';
import { UpdateApontamentoDto } from '../dto/update-apontamento.dto';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class ApontamentosRepository extends IApontamentosRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {
    super();
  }

  async create(data: CreateApontamentoDto): Promise<Apontamento> {
    this.logger.debug('Criando novo apontamento', { data }, 'ApontamentosRepository');
    
    try {
      const apontamento = await this.prisma.apontamento.create({
        data: {
          opId: data.opId,
          maquinaId: data.maquinaId,
          usuarioId: data.usuarioId,
          quantidadeProduzida: data.quantidadeProduzida ?? 0,
          quantidadeDefeito: data.quantidadeDefeito ?? 0,
          dataInicio: typeof data.dataInicio === 'string' ? new Date(data.dataInicio) : data.dataInicio,
          dataFim: data.dataFim 
            ? (typeof data.dataFim === 'string' ? new Date(data.dataFim) : data.dataFim)
            : null,
        },
      });

      this.logger.info('Apontamento criado com sucesso', { apontamentoId: apontamento.id }, 'ApontamentosRepository');
      return this.mapToEntity(apontamento);
    } catch (error) {
      this.logger.errorWithMeta('Erro ao criar apontamento', error, { data }, 'ApontamentosRepository');
      throw error;
    }
  }

  async findAll(filters?: any): Promise<Apontamento[]> {
    this.logger.debug('Buscando todos os apontamentos', { filters }, 'ApontamentosRepository');
    
    const whereClause: any = {};

    if (filters?.opId) whereClause.opId = filters.opId;
    if (filters?.maquinaId) whereClause.maquinaId = filters.maquinaId;
    if (filters?.usuarioId) whereClause.usuarioId = filters.usuarioId;

    if (filters?.dataInicio || filters?.dataFim) {
      whereClause.AND = [];
      if (filters?.dataInicio) {
        whereClause.AND.push({
          dataInicio: { gte: typeof filters.dataInicio === 'string' ? new Date(filters.dataInicio) : filters.dataInicio },
        });
      }
      if (filters?.dataFim) {
        whereClause.AND.push({
          dataInicio: { lte: typeof filters.dataFim === 'string' ? new Date(filters.dataFim) : filters.dataFim },
        });
      }
    }

    try {
      const apontamentos = await this.prisma.apontamento.findMany({
        where: whereClause,
        orderBy: {
          dataInicio: 'desc',
        },
      });

      this.logger.info('Apontamentos encontrados', { count: apontamentos.length }, 'ApontamentosRepository');
      return apontamentos.map((a) => this.mapToEntity(a));
    } catch (error) {
      this.logger.errorWithMeta('Erro ao buscar apontamentos', error, { filters }, 'ApontamentosRepository');
      throw error;
    }
  }

  async findOne(id: number): Promise<Apontamento | null> {
    this.logger.debug('Buscando apontamento por ID', { id }, 'ApontamentosRepository');
    
    try {
      const apontamento = await this.prisma.apontamento.findUnique({
        where: { id },
      });

      if (apontamento) {
        this.logger.debug('Apontamento encontrado', { id }, 'ApontamentosRepository');
      } else {
        this.logger.warn('Apontamento não encontrado', { id }, 'ApontamentosRepository');
      }

      return apontamento ? this.mapToEntity(apontamento) : null;
    } catch (error) {
      this.logger.errorWithMeta('Erro ao buscar apontamento por ID', error, { id }, 'ApontamentosRepository');
      throw error;
    }
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
              { dataFim: null }, // Inclui apontamentos sem fim nesse período
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

  async update(id: number, data: UpdateApontamentoDto): Promise<Apontamento> {
    this.logger.debug('Atualizando apontamento', { id, data }, 'ApontamentosRepository');
    
    const updateData: any = {};

    if (data.opId !== undefined) updateData.opId = data.opId;
    if (data.maquinaId !== undefined) updateData.maquinaId = data.maquinaId;
    if (data.usuarioId !== undefined) updateData.usuarioId = data.usuarioId;
    if (data.quantidadeProduzida !== undefined) updateData.quantidadeProduzida = data.quantidadeProduzida;
    if (data.quantidadeDefeito !== undefined) updateData.quantidadeDefeito = data.quantidadeDefeito;
    if (data.dataInicio !== undefined) {
      updateData.dataInicio = typeof data.dataInicio === 'string' ? new Date(data.dataInicio) : data.dataInicio;
    }
    if (data.dataFim !== undefined) {
      updateData.dataFim = data.dataFim
        ? (typeof data.dataFim === 'string' ? new Date(data.dataFim) : data.dataFim)
        : null;
    }

    try {
      const apontamento = await this.prisma.apontamento.update({
        where: { id },
        data: updateData,
      });

      this.logger.info('Apontamento atualizado com sucesso', { id }, 'ApontamentosRepository');
      return this.mapToEntity(apontamento);
    } catch (error) {
      this.logger.errorWithMeta('Erro ao atualizar apontamento', error, { id, data }, 'ApontamentosRepository');
      throw error;
    }
  }

  async remove(id: number): Promise<Apontamento> {
    this.logger.debug('Removendo apontamento', { id }, 'ApontamentosRepository');
    
    try {
      const apontamento = await this.prisma.apontamento.delete({
        where: { id },
      });

      this.logger.info('Apontamento removido com sucesso', { id }, 'ApontamentosRepository');
      return this.mapToEntity(apontamento);
    } catch (error) {
      this.logger.errorWithMeta('Erro ao remover apontamento', error, { id }, 'ApontamentosRepository');
      throw error;
    }
  }

  private mapToEntity(prismaApontamento: any): Apontamento {
    const apontamento = new Apontamento();
    apontamento.id = prismaApontamento.id;
    apontamento.opId = prismaApontamento.opId;
    apontamento.maquinaId = prismaApontamento.maquinaId;
    apontamento.usuarioId = prismaApontamento.usuarioId;
    apontamento.quantidadeProduzida = prismaApontamento.quantidadeProduzida;
    apontamento.quantidadeDefeito = prismaApontamento.quantidadeDefeito;
    apontamento.dataInicio = prismaApontamento.dataInicio;
    apontamento.dataFim = prismaApontamento.dataFim;
    return apontamento;
  }
}
