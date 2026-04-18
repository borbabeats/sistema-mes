import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { OrdemProducaoStatusLog } from '../../../domain/entities/ordens-producao-status-log.entity';
import { IOrdemProducaoStatusLogRepository } from '../../../domain/repositories/ordens-producao-status-log.repository.interface';

@Injectable()
export class OrdemProducaoStatusLogRepository implements IOrdemProducaoStatusLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    ordemId: number;
    deStatus: string;
    paraStatus: string;
    motivo?: string;
    usuarioId?: number;
  }): Promise<OrdemProducaoStatusLog> {
    const log = await this.prisma.ordemProducaoStatusLog.create({
      data: {
        ordem_id: data.ordemId,
        de_status: data.deStatus as any, // Prisma enum
        para_status: data.paraStatus as any, // Prisma enum
        motivo: data.motivo,
        usuario_id: data.usuarioId,
      },
    });

    return this.mapToEntity(log);
  }

  async findByOrdemId(ordemId: number): Promise<OrdemProducaoStatusLog[]> {
    const logs = await this.prisma.ordemProducaoStatusLog.findMany({
      where: { ordem_id: ordemId },
      orderBy: { created_at: 'desc' },
    });

    return logs.map((log) => this.mapToEntity(log));
  }

  private mapToEntity(prismaLog: any): OrdemProducaoStatusLog {
    return new OrdemProducaoStatusLog({
      id: prismaLog.id,
      ordemId: prismaLog.ordem_id,
      deStatus: prismaLog.de_status,
      paraStatus: prismaLog.para_status,
      motivo: prismaLog.motivo,
      usuarioId: prismaLog.usuario_id,
      createdAt: prismaLog.created_at,
    });
  }
}
