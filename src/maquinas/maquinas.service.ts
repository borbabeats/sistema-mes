import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMaquinaDto } from './dto/create-maquina.dto';
import { UpdateMaquinaDto } from './dto/update-maquina.dto';
import { CreateManutencaoDto } from './dto/create-manutencao.dto';
import { UpdateManutencaoDto } from './dto/update-manutencao.dto';
import { StatusMaquina, TipoManutencao, StatusManutencao } from './entities/maquina.entity';

@Injectable()
export class MaquinasService {
  constructor(private prisma: PrismaService) {}

  // Métodos para Máquinas

  async create(createMaquinaDto: CreateMaquinaDto) {
    // Verifica se já existe uma máquina com o mesmo código
    const existingMaquina = await this.prisma.maquina.findFirst({
      where: { codigo: createMaquinaDto.codigo },
    });

    if (existingMaquina) {
      throw new ConflictException('Já existe uma máquina com este código');
    }

    // Verifica se o setor existe, se fornecido
    if (createMaquinaDto.setorId) {
      const setorExists = await this.prisma.setor.findFirst({
        where: { id: createMaquinaDto.setorId, deleted_at: null },
      });

      if (!setorExists) {
        throw new NotFoundException('Setor não encontrado');
      }
    }

    const { setorId, ...maquinaData } = createMaquinaDto;
    
    return this.prisma.maquina.create({
      data: {
        ...maquinaData,
        setor_id: setorId,
      },
      include: {
        setor: true
      }
    });
  }

  async findAll(fiter?: any) {
    return this.prisma.maquina.findMany({
      where: fiter,
      include: { setor: true },
    });
  }

  async findOne(id: number) {
    const maquina = await this.prisma.maquina.findFirst({
      where: { id },
      include: { 
        setor: true,
        manutencoes: {
          orderBy: { dataAgendada: 'desc' },
          take: 5, // Retorna as 5 últimas manutenções
        },
      },
    });

    if (!maquina) {
      throw new NotFoundException(`Máquina com ID ${id} não encontrada`);
    }

    return maquina;
  }

  async update(id: number, updateMaquinaDto: UpdateMaquinaDto) {
    // Verifica se a máquina existe
    const maquina = await this.prisma.maquina.findFirst({
      where: { id },
    });

    if (!maquina) {
      throw new NotFoundException(`Máquina com ID ${id} não encontrada`);
    }

    // Verifica se o código já está sendo usado por outra máquina
    if (updateMaquinaDto.codigo && updateMaquinaDto.codigo !== maquina.codigo) {
      const existingMaquina = await this.prisma.maquina.findFirst({
        where: { 
          codigo: updateMaquinaDto.codigo, 
          NOT: { id },
        },
      });

      if (existingMaquina) {
        throw new ConflictException('Já existe outra máquina com este código');
      }
    }

    // Verifica se o setor existe, se fornecido
    if (updateMaquinaDto.setorId) {
      const setorExists = await this.prisma.setor.findFirst({
        where: { id: updateMaquinaDto.setorId },
      });

      if (!setorExists) {
        throw new NotFoundException('Setor não encontrado');
      }
    }

    return this.prisma.maquina.update({
      where: { id },
      data: {
        ...updateMaquinaDto,
        setor: updateMaquinaDto.setorId 
          ? { connect: { id: updateMaquinaDto.setorId } } 
          : undefined,
      },
    });
  }

  async remove(id: number) {
    // Verifica se a máquina existe
    const maquina = await this.prisma.maquina.findFirst({
      where: { id },
    });

    if (!maquina) {
      throw new NotFoundException(`Máquina com ID ${id} não encontrada`);
    }

    // Verifica se a máquina está em uso em alguma ordem de produção ativa
    const apontamentoAtivo = await this.prisma.apontamento.findFirst({
      where: {
        maquinaId: id,
        dataFim: null,
      },
    });

    if (apontamentoAtivo) {
      throw new BadRequestException('Não é possível remover uma máquina que está em uso');
    }

    // Soft delete
    return this.prisma.maquina.update({
      where: { id },
      data: { 
        deleted_at: new Date(),
        // Remove a associação com o setor para evitar problemas de chave estrangeira
        setor: { disconnect: true },
      },
    });
  }

  // Métodos para Manutenções

  async createManutencao(createManutencaoDto: CreateManutencaoDto) {
    // Verifica se a máquina existe
    const maquina = await this.prisma.maquina.findFirst({
      where: { id: createManutencaoDto.maquinaId },
    });

    if (!maquina) {
      throw new NotFoundException('Máquina não encontrada');
    }

    // Verifica se o responsável existe, se fornecido
    if (createManutencaoDto.responsavelId) {
      const responsavel = await this.prisma.usuario.findFirst({
        where: { id: createManutencaoDto.responsavelId },
      });

      if (!responsavel) {
        throw new NotFoundException('Responsável não encontrado');
      }
    }

    // Se a manutenção for do tipo CORRETIVA, atualiza o status da máquina para MANUTENCAO
    if (createManutencaoDto.tipo === 'CORRETIVA') {
      await this.prisma.maquina.update({
        where: { id: createManutencaoDto.maquinaId },
        data: { status: 'MANUTENCAO' },
      });
    }

    const { maquinaId, responsavelId, ...manutencaoData } = createManutencaoDto;
    const manutencao = await this.prisma.manutencao.create({
      data: {
        ...manutencaoData,
        maquina: { connect: { id: maquinaId } },
        responsavel: responsavelId 
          ? { connect: { id: createManutencaoDto.responsavelId } } 
          : undefined,
      },
      include: {
        maquina: true,
        responsavel: true,
      },
    });

    // Cria o primeiro registro no histórico
    await this.prisma.historicoManutencao.create({
      data: {
        manutencaoId: manutencao.id,
        statusNovo: manutencao.status,
        descricao: 'Manutenção criada',
      },
    });

    return manutencao;
  }

  async findAllManutencoes(maquinaId?: number, status?: StatusManutencao) {
    return this.prisma.manutencao.findMany({
      where: { 
        ...(maquinaId && { maquinaId }),
        ...(status && { status }),
      },
      include: {
        maquina: true,
        responsavel: true,
      },
      orderBy: { dataAgendada: 'desc' },
    });
  }

  async findManutencaoById(id: number) {
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

    if (!manutencao) {
      throw new NotFoundException(`Manutenção com ID ${id} não encontrada`);
    }

    return manutencao;
  }

  async updateManutencao(id: number, updateManutencaoDto: UpdateManutencaoDto) {
    // Verifica se a manutenção existe
    const manutencao = await this.prisma.manutencao.findUnique({
      where: { id },
    });

    if (!manutencao) {
      throw new NotFoundException(`Manutenção com ID ${id} não encontrada`);
    }

    // Verifica se a máquina existe, se for fornecida
    if (updateManutencaoDto.maquinaId) {
      const maquina = await this.prisma.maquina.findFirst({
        where: { id: updateManutencaoDto.maquinaId },
      });

      if (!maquina) {
        throw new NotFoundException('Máquina não encontrada');
      }
    }

    // Verifica se o responsável existe, se fornecido
    if (updateManutencaoDto.responsavelId) {
      const responsavel = await this.prisma.usuario.findFirst({
        where: { id: updateManutencaoDto.responsavelId },
      });

      if (!responsavel) {
        throw new NotFoundException('Responsável não encontrado');
      }
    }

    // Se o status estiver sendo atualizado, registra no histórico
    const historicoData = updateManutencaoDto.status && updateManutencaoDto.status !== manutencao.status
      ? {
          historico: {
            create: {
              statusAnterior: manutencao.status,
              statusNovo: updateManutencaoDto.status,
              descricao: 'Status atualizado',
            },
          },
        }
      : {};

    const { maquinaId, responsavelId, ...updateData } = updateManutencaoDto;
    
    // Prepare the update data object with proper typing
    const updateInput: any = { ...updateData };
    
    // Handle maquinaId connection
    if (maquinaId !== undefined) {
      updateInput.maquina = maquinaId 
        ? { connect: { id: maquinaId } }
        : { disconnect: true };
    }
    
    // Handle responsavelId connection
    if (responsavelId !== undefined) {
      updateInput.responsavel = responsavelId !== null
        ? { connect: { id: responsavelId } }
        : { disconnect: true };
    }
    
    // Add historico data if it exists
    if (historicoData) {
      Object.assign(updateInput, historicoData);
    }
    
    const updatedManutencao = await this.prisma.manutencao.update({
      where: { id },
      data: updateInput,
      include: {
        maquina: true,
        responsavel: true,
        historico: {
          orderBy: {
            dataRegistro: 'desc',
          },
          take: 10,
        }
      },
    });

    // Se a manutenção foi concluída, atualiza o status da máquina para DISPONIVEL
    if (updateManutencaoDto.status === 'CONCLUIDA' && manutencao.status !== 'CONCLUIDA') {
      await this.prisma.maquina.update({
        where: { id: updatedManutencao.maquinaId },
        data: { status: 'DISPONIVEL' },
      });
    }

    return updatedManutencao;
  }

  async removeManutencao(id: number) {
    // Verifica se a manutenção existe
    const manutencao = await this.prisma.manutencao.findFirst({
      where: { id },
    });

    if (!manutencao) {
      throw new NotFoundException(`Manutenção com ID ${id} não encontrada`);
    }

    // Soft delete
    return this.prisma.manutencao.update({
      where: { id },
      data: { 
        // Remove a associação com o responsável para evitar problemas de chave estrangeira
        responsavel: { disconnect: true },
      },
    });
  }

  // Métodos para Histórico de Manutenção

  async findHistoricoManutencao(manutencaoId: number) {
    // Verifica se a manutenção existe
    const manutencao = await this.prisma.manutencao.findFirst({
      where: { id: manutencaoId },
    });

    if (!manutencao) {
      throw new NotFoundException(`Manutenção com ID ${manutencaoId} não encontrada`);
    }

    return this.prisma.historicoManutencao.findMany({
      where: { manutencaoId },
      orderBy: { dataRegistro: 'desc' },
    });
  }

  // Métodos para controle de tempo de operação

  async getTempoUsoMaquina(maquinaId: number, periodoInicio: Date, periodoFim: Date) {
    // Verifica se a máquina existe
    const maquina = await this.prisma.maquina.findFirst({
      where: { id: maquinaId },
    });

    if (!maquina) {
      throw new NotFoundException(`Máquina com ID ${maquinaId} não encontrada`);
    }

    // Busca os apontamentos no período
    const apontamentos = await this.prisma.apontamento.findMany({
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

    // Calcula o tempo total de operação em horas
    let tempoTotalMs = 0;
    
    for (const apontamento of apontamentos) {
      const inicio = new Date(apontamento.dataInicio).getTime();
      const fim = apontamento.dataFim 
        ? new Date(apontamento.dataFim).getTime() 
        : Date.now(); // Se não tiver data de fim, usa o momento atual
      
      tempoTotalMs += fim - inicio;
    }

    // Converte para horas
    const horasUso = tempoTotalMs / (1000 * 60 * 60);

    return {
      maquinaId,
      periodoInicio,
      periodoFim,
      horasUso,
      apontamentosContabilizados: apontamentos.length,
    };
  }
}
