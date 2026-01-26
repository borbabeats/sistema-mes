import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { IMaquinaRepository } from './interfaces/maquina.repository.interface';
import { CreateMaquinaDto } from './dto/create-maquina.dto';
import { UpdateMaquinaDto } from './dto/update-maquina.dto';
import { CreateManutencaoDto } from './dto/create-manutencao.dto';
import { UpdateManutencaoDto } from './dto/update-manutencao.dto';
import { Maquina } from './entities/maquina.entity';
import { Manutencao } from './entities/manutencao.entity';
import { StatusMaquina, TipoManutencao, StatusManutencao } from './entities/maquina.entity';

@Injectable()
export class MaquinasService {
  constructor(private readonly repository: IMaquinaRepository) {}

  // Métodos para Máquinas

  async create(createMaquinaDto: CreateMaquinaDto): Promise<Maquina> {
    const existingMaquina = await this.repository.findByCodigo(createMaquinaDto.codigo);

    if (existingMaquina) {
      throw new ConflictException('Já existe uma máquina com este código');
    }

    return this.repository.create(createMaquinaDto);
  }

  async findAll(filter?: any): Promise<Maquina[]> {
    return this.repository.findAll(filter);
  }

  async findOne(id: number): Promise<Maquina> {
    const maquina = await this.repository.findOne(id);

    if (!maquina) {
      throw new NotFoundException(`Máquina com ID ${id} não encontrada`);
    }

    return maquina;
  }

  async update(id: number, updateMaquinaDto: UpdateMaquinaDto): Promise<Maquina> {
    await this.findOne(id); // Verifica se a máquina existe

    // Verifica se o código já está sendo usado por outra máquina
    if (updateMaquinaDto.codigo) {
      const existingMaquina = await this.repository.findByCodigo(updateMaquinaDto.codigo);
      
      if (existingMaquina && existingMaquina.id !== id) {
        throw new ConflictException('Já existe outra máquina com este código');
      }
    }

    return this.repository.update(id, updateMaquinaDto);
  }

  async remove(id: number): Promise<Maquina> {
    await this.findOne(id); // Verifica se a máquina existe
    return this.repository.remove(id);
  }

  // Métodos para Manutenções

  async createManutencao(createManutencaoDto: CreateManutencaoDto) {
    // Verifica se a máquina existe
    const maquina = await this.repository.findOne(createManutencaoDto.maquinaId);
    if (!maquina) {
      throw new NotFoundException('Máquina não encontrada');
    }

    // Se a manutenção for do tipo CORRETIVA, atualiza o status da máquina para MANUTENCAO
    if (createManutencaoDto.tipo === 'CORRETIVA') {
      await this.repository.update(createManutencaoDto.maquinaId, { status: 'MANUTENCAO' as any });
    }

    // Cria a manutenção via repository
    const manutencao = await this.repository.createManutencao(createManutencaoDto as any);

    // Cria o primeiro registro no histórico
    await this.repository.createHistoricoManutencao({
      manutencaoId: manutencao.id,
      statusNovo: manutencao.status,
      descricao: 'Manutenção criada',
    });

    return manutencao;
  }

  async findAllManutencoes(maquinaId?: number, status?: StatusManutencao) {
    if (maquinaId) {
      return this.repository.findManutencoesByMaquina(maquinaId, status);
    }
    
    // Se nenhum filtro de máquina, retorna todas as manutenções (implementar se necessário)
    return [];
  }

  async findManutencaoById(id: number) {
    const manutencao = await this.repository.findManutencaoById(id);

    if (!manutencao) {
      throw new NotFoundException(`Manutenção com ID ${id} não encontrada`);
    }

    return manutencao;
  }

  async updateManutencao(id: number, updateManutencaoDto: UpdateManutencaoDto) {
    // Verifica se a manutenção existe
    const manutencao = await this.repository.findManutencaoById(id);

    if (!manutencao) {
      throw new NotFoundException(`Manutenção com ID ${id} não encontrada`);
    }

    // Verifica se a máquina existe, se for fornecida
    if (updateManutencaoDto.maquinaId) {
      const maquina = await this.repository.findOne(updateManutencaoDto.maquinaId);
      if (!maquina) {
        throw new NotFoundException('Máquina não encontrada');
      }
    }

    // Registra no histórico se o status estiver sendo atualizado
    if (updateManutencaoDto.status && updateManutencaoDto.status !== manutencao.status) {
      await this.repository.createHistoricoManutencao({
        manutencaoId: id,
        statusAnterior: manutencao.status,
        statusNovo: updateManutencaoDto.status,
        descricao: 'Status atualizado',
      });
    }

    // Atualiza a manutenção
    const updatedManutencao = await this.repository.updateManutencao(id, updateManutencaoDto);

    // Se a manutenção foi concluída, atualiza o status da máquina para DISPONIVEL
    if (updateManutencaoDto.status === 'CONCLUIDA' && manutencao.status !== 'CONCLUIDA') {
      await this.repository.update(updatedManutencao.maquinaId, { status: 'DISPONIVEL' as any });
    }

    return updatedManutencao;
  }

  async removeManutencao(id: number) {
    // Verifica se a manutenção existe
    const manutencao = await this.repository.findManutencaoById(id);

    if (!manutencao) {
      throw new NotFoundException(`Manutenção com ID ${id} não encontrada`);
    }

    return this.repository.removeManutencao(id);
  }

  // Métodos para Histórico de Manutenção

  async findHistoricoManutencao(manutencaoId: number) {
    // Verifica se a manutenção existe
    const manutencao = await this.repository.findManutencaoById(manutencaoId);

    if (!manutencao) {
      throw new NotFoundException(`Manutenção com ID ${manutencaoId} não encontrada`);
    }

    return this.repository.findHistoricoManutencao(manutencaoId);
  }

  // Métodos para controle de tempo de operação

  async getTempoUsoMaquina(maquinaId: number, periodoInicio: Date, periodoFim: Date) {
    // Verifica se a máquina existe
    const maquina = await this.repository.findOne(maquinaId);

    if (!maquina) {
      throw new NotFoundException(`Máquina com ID ${maquinaId} não encontrada`);
    }

    // Busca os apontamentos no período via repository
    const apontamentos = await this.repository.findApontamentosByPeriodo(
      maquinaId,
      periodoInicio,
      periodoFim
    );

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
