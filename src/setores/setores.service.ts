import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSetorDto } from './dto/create-setor.dto';
import { UpdateSetorDto } from './dto/update-setor.dto';

@Injectable()
export class SetoresService {
  constructor(private prisma: PrismaService) {}

  async create(createSetorDto: CreateSetorDto) {
    // Verifica se já existe um setor com o mesmo nome
    const setorExistente = await this.prisma.setor.findFirst({
      where: { nome: createSetorDto.nome },
    });

    if (setorExistente) {
      throw new ConflictException('Já existe um setor com este nome');
    }

    return this.prisma.setor.create({
      data: {
        nome: createSetorDto.nome,
      },
    });
  }

  async findAll() {
    return this.prisma.setor.findMany({
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
  }

  async findOne(id: number) {
    const setor = await this.prisma.setor.findFirst({
      where: {
        id: id,
        deleted_at: null
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
      },
    });

    if (!setor) {
      throw new NotFoundException(`Setor com ID ${id} não encontrado`);
    }

    return setor;
  }

  async update(id: number, updateSetorDto: UpdateSetorDto) {
    // Verifica se o setor existe
    await this.findOne(id);

    // Se estiver tentando atualizar o nome, verifica se já não existe outro com o mesmo nome
    if (updateSetorDto.nome) {
      const setorComMesmoNome = await this.prisma.setor.findFirst({
        where: {
          nome: updateSetorDto.nome,
          NOT: { id },
        },
      });

      if (setorComMesmoNome) {
        throw new ConflictException('Já existe um setor com este nome');
      }
    }

    return this.prisma.setor.update({
      where: { id },
      data: updateSetorDto,
    });
  }

  async remove(id: number) {
    // Verifica se o setor existe e obtém as contagens de relacionamentos
    const setorComRelacionamentos = await this.prisma.setor.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            usuarios: true,
            maquinas: true,
          },
        },
      },
    });

    if (!setorComRelacionamentos) {
      throw new NotFoundException(`Setor com ID ${id} não encontrado`);
    }

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
      
      return prisma.setor.update({
        where: { id },
        data: {
          deleted_at: new Date(),
        },
      });
    });
  }

  async findDeleted() {
    return this.prisma.setor.findMany({
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
  }

  async restore(id: number) {
   const setor = await this.prisma.setor.findFirst({
    where: {
      id,
      NOT: { deleted_at: null },
    }
   });

   if (!setor) {
    throw new NotFoundException(`Setor com ID ${id} não encontrado ou já restaurado`);
   } 
   return this.prisma.setor.update({
    where: { id },
    data: {
      deleted_at: null,
    },
   })
  }
}
