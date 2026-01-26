import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Setor } from '../entities/setor.entity';
import { ISetorRepository } from '../interfaces/setor.repository.interface';

@Injectable()
export class SetorRepository extends ISetorRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: Partial<Setor>): Promise<Setor> {
    const { id, created_at, updated_at, deleted_at, usuarios, ...createData } = data;
    
    const setor = await this.prisma.setor.create({
      data: createData as any,
      include: {
        usuarios: true,
        maquinas: true,
      },
    });

    return this.mapToEntity(setor);
  }

  async findAll(): Promise<Setor[]> {
    const setores = await this.prisma.setor.findMany({
      where: {
        deleted_at: null,
      },
      include: {
        _count: {
          select: {
            usuarios: {
              where: {
                deleted_at: null,
              },
            },
            maquinas: {
              where: {
                deleted_at: null,
              },
            },
          },
        },
      },
    });

    return setores.map(setor => this.mapToEntity(setor));
  }

  async findOne(id: number): Promise<Setor | null> {
    const setor = await this.prisma.setor.findFirst({
      where: {
        id,
        deleted_at: null,
      },
      include: {
        usuarios: {
          select: {
            id: true,
            nome: true,
            email: true,
            cargo: true,
          },
        },
        maquinas: {
          select: {
            id: true,
            nome: true,
            status: true,
          },
        },
        _count: {
          select: {
            usuarios: {
              where: {
                deleted_at: null,
              },
            },
            maquinas: {
              where: {
                deleted_at: null,
              },
            },
          },
        },
      },
    });

    return setor ? this.mapToEntity(setor) : null;
  }

  async findByName(nome: string): Promise<Setor | null> {
    const setor = await this.prisma.setor.findFirst({
      where: { nome },
      include: {
        usuarios: true,
        maquinas: true,
      },
    });

    return setor ? this.mapToEntity(setor) : null;
  }

  async findByNameExcludingId(nome: string, id: number): Promise<Setor | null> {
    const setor = await this.prisma.setor.findFirst({
      where: {
        nome,
        NOT: { id },
      },
      include: {
        usuarios: true,
        maquinas: true,
      },
    });

    return setor ? this.mapToEntity(setor) : null;
  }

  async update(id: number, data: Partial<Setor>): Promise<Setor> {
    const { id: _, created_at, updated_at, deleted_at, usuarios, ...updateData } = data;

    const setor = await this.prisma.setor.update({
      where: { id },
      data: updateData as any,
      include: {
        usuarios: true,
        maquinas: true,
      },
    });

    return this.mapToEntity(setor);
  }

  async remove(id: number): Promise<Setor> {
    return this.prisma.$transaction(async (prisma) => {
      await prisma.usuario.updateMany({
        where: {
          setor_id: id,
          deleted_at: null,
        },
        data: {
          deleted_at: new Date(),
        },
      });

      await prisma.maquina.updateMany({
        where: {
          setor_id: id,
          deleted_at: null,
        },
        data: {
          deleted_at: new Date(),
        },
      });
      
      const setor = await prisma.setor.update({
        where: { id },
        data: {
          deleted_at: new Date(),
        },
        include: {
          usuarios: true,
          maquinas: true,
        },
      });

      return this.mapToEntity(setor);
    });
  }

  async findDeleted(): Promise<Setor[]> {
    const setores = await this.prisma.setor.findMany({
      where: {
        deleted_at: {
          not: null,
        },
      },
      include: {
        _count: {
          select: {
            usuarios: true,
            maquinas: true,
          }
        }
      }
    });

    return setores.map(setor => this.mapToEntity(setor));
  }

  async restore(id: number): Promise<Setor> {
    const setor = await this.prisma.setor.update({
      where: { id },
      data: {
        deleted_at: null,
      },
      include: {
        usuarios: true,
        maquinas: true,
      },
    });

    return this.mapToEntity(setor);
  }

  private mapToEntity(prismaSetor: any): Setor {
    return {
      id: prismaSetor.id,
      nome: prismaSetor.nome,
      usuarios: prismaSetor.usuarios,
      maquinas: prismaSetor.maquinas,
      qtdUsuarios: prismaSetor._count?.usuarios || 0,
      qtdMaquinas: prismaSetor._count?.maquinas || 0,
      created_at: prismaSetor.created_at,
      updated_at: prismaSetor.updated_at,
      deleted_at: prismaSetor.deleted_at,
    };
  }
}
