import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { IOrdensProducaoRepository } from './interfaces/ordens-producao.repository.interface';
import { CreateOrdemProducaoDto } from './dto/create-ordem-producao.dto';
import { UpdateOrdemProducaoDto } from './dto/update-ordem-producao.dto';
import { FilterOrdemProducaoDto } from './dto/filter-ordem-producao.dto';
import { OrdemProducao } from './entities/ordem-producao-entity';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdensProducaoService {
  constructor(
    private readonly repository: IOrdensProducaoRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(createOrdemProducaoDto: CreateOrdemProducaoDto): Promise<OrdemProducao> {
    // Verificar se o setor existe
    const setorExists = await this.prisma.setor.findUnique({
      where: { id: createOrdemProducaoDto.setorId, deleted_at: null },
    });
    if (!setorExists) {
      throw new NotFoundException(`Setor com ID ${createOrdemProducaoDto.setorId} não encontrado`);
    }

    // Verificar se o responsável existe, se fornecido
    if (createOrdemProducaoDto.responsavelId) {
      const responsavelExists = await this.prisma.usuario.findUnique({
        where: { id: createOrdemProducaoDto.responsavelId, deleted_at: null },
      });
      if (!responsavelExists) {
        throw new NotFoundException(`Usuário responsável com ID ${createOrdemProducaoDto.responsavelId} não encontrado`);
      }
    }

    // Verificar se os operadores existem, se fornecidos
    if (createOrdemProducaoDto.operadoresIds && createOrdemProducaoDto.operadoresIds.length > 0) {
      const operadoresCount = await this.prisma.usuario.count({
        where: {
          id: { in: createOrdemProducaoDto.operadoresIds },
          deleted_at: null,
        },
      });
      if (operadoresCount !== createOrdemProducaoDto.operadoresIds.length) {
        throw new NotFoundException('Um ou mais operadores não foram encontrados');
      }
    }

    return this.repository.create(createOrdemProducaoDto);
  }

  async findAll(filters?: FilterOrdemProducaoDto): Promise<OrdemProducao[]> {
    return this.repository.findAll(filters);
  }

  async findOne(id: number): Promise<OrdemProducao> {
    const ordem = await this.repository.findOne(id);

    if (!ordem) {
      throw new NotFoundException(`Ordem de produção com ID ${id} não encontrada`);
    }

    return ordem;
  }

  async update(
    id: number,
    updateOrdemProducaoDto: UpdateOrdemProducaoDto,
  ): Promise<OrdemProducao> {
    // Verificar se a ordem de produção existe
    const ordemExistente = await this.repository.findOne(id);

    if (!ordemExistente) {
      throw new NotFoundException(`Ordem de produção com ID ${id} não encontrada`);
    }

    // Verificar se o setor existe, se for atualizado
    if (updateOrdemProducaoDto.setorId) {
      const setorExists = await this.prisma.setor.findUnique({
        where: { id: updateOrdemProducaoDto.setorId, deleted_at: null },
      });
      if (!setorExists) {
        throw new NotFoundException(`Setor com ID ${updateOrdemProducaoDto.setorId} não encontrado`);
      }
    }

    // Verificar se o responsável existe, se fornecido
    if (updateOrdemProducaoDto.responsavelId) {
      const responsavelExists = await this.prisma.usuario.findUnique({
        where: { id: updateOrdemProducaoDto.responsavelId, deleted_at: null },
      });
      if (!responsavelExists) {
        throw new NotFoundException(`Usuário responsável com ID ${updateOrdemProducaoDto.responsavelId} não encontrado`);
      }
    }

    // Verificar se os operadores existem, se fornecidos
    if (updateOrdemProducaoDto.operadoresIds && updateOrdemProducaoDto.operadoresIds.length > 0) {
      const operadoresCount = await this.prisma.usuario.count({
        where: {
          id: { in: updateOrdemProducaoDto.operadoresIds },
          deleted_at: null,
        },
      });
      if (operadoresCount !== updateOrdemProducaoDto.operadoresIds.length) {
        throw new NotFoundException('Um ou mais operadores não foram encontrados');
      }
    }

    return this.repository.update(id, updateOrdemProducaoDto);
  }

  async remove(id: number): Promise<{ message: string; id: number; codigo: string }> {
    // Verificar se a ordem de produção existe
    const ordemExistente = await this.repository.findOne(id);

    if (!ordemExistente) {
      throw new NotFoundException(`Ordem de produção com ID ${id} não encontrada`);
    }

    await this.repository.remove(id);
    
    return {
      message: 'Ordem de produção removida com sucesso',
      id,
      codigo: ordemExistente.codigo,
    };
  }

  async iniciarProducao(id: number): Promise<OrdemProducao> {
    const ordem = await this.repository.findOne(id);

    if (!ordem) {
      throw new NotFoundException(`Ordem de produção com ID ${id} não encontrada`);
    }

    if (ordem.status === 'FINALIZADA' || ordem.status === 'CANCELADA') {
      throw new BadRequestException(
        `Não é possível iniciar uma ordem de produção com status ${ordem.status}`,
      );
    }

    return this.repository.iniciarProducao(id);
  }

  async pausarProducao(id: number): Promise<OrdemProducao> {
    const ordem = await this.repository.findOne(id);

    if (!ordem) {
      throw new NotFoundException(`Ordem de produção com ID ${id} não encontrada`);
    }

    if (ordem.status !== 'EM_ANDAMENTO') {
      throw new BadRequestException(
        `Só é possível pausar uma ordem de produção que está em andamento. Status atual: ${ordem.status}`,
      );
    }

    return this.repository.pausarProducao(id);
  }

  async retomarProducao(id: number): Promise<OrdemProducao> {
    const ordem = await this.repository.findOne(id);

    if (!ordem) {
      throw new NotFoundException(`Ordem de produção com ID ${id} não encontrada`);
    }

    if (ordem.status !== 'PAUSADA') {
      throw new BadRequestException(
        `Só é possível retomar uma ordem de produção que está pausada. Status atual: ${ordem.status}`,
      );
    }

    return this.repository.retomarProducao(id);
  }

  async finalizarProducao(id: number): Promise<OrdemProducao> {
    const ordem = await this.repository.findOne(id);

    if (!ordem) {
      throw new NotFoundException(`Ordem de produção com ID ${id} não encontrada`);
    }

    if (ordem.status === 'FINALIZADA' || ordem.status === 'CANCELADA') {
      throw new BadRequestException(
        `Não é possível finalizar uma ordem de produção com status ${ordem.status}`,
      );
    }

    return this.repository.finalizarProducao(id);
  }

  async cancelarProducao(id: number, motivo: string): Promise<OrdemProducao> {
    const ordem = await this.repository.findOne(id);

    if (!ordem) {
      throw new NotFoundException(`Ordem de produção com ID ${id} não encontrada`);
    }

    if (ordem.status === 'FINALIZADA' || ordem.status === 'CANCELADA') {
      throw new BadRequestException(
        `Não é possível cancelar uma ordem de produção com status ${ordem.status}`,
      );
    }

    return this.repository.cancelarProducao(id, motivo);
  }

  async atualizarProducao(
    id: number,
    quantidadeProduzida: number,
    quantidadeDefeito: number = 0,
  ): Promise<OrdemProducao> {
    const ordem = await this.repository.findOne(id);

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

    return this.repository.atualizarProducao(id, quantidadeProduzida, quantidadeDefeito);
  }
}