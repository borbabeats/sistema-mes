import { Injectable, Inject } from '@nestjs/common';
import { IMaquinasRepository } from '../../../domain/repositories/maquinas.repository.interface';
import { Maquina, StatusMaquina } from '../../../domain/entities/maquina.entity';
import { MAQUINAS_REPOSITORY_TOKEN } from '../../../domain/repositories/maquinas.repository.interface';

export interface IniciarManutencaoData {
  tipo: string;
  descricao: string;
  previsaoTermino?: Date;
  responsavel?: string;
}

@Injectable()
export class IniciarManutencaoUseCase {
  constructor(
    @Inject(MAQUINAS_REPOSITORY_TOKEN) private readonly maquinasRepository: IMaquinasRepository,
  ) {}

  async execute(id: number, manutencaoData: IniciarManutencaoData): Promise<Maquina> {
    // Verificar se a máquina existe
    const maquina = await this.maquinasRepository.findOne(id);
    if (!maquina) {
      throw new Error('Máquina não encontrada');
    }

    // Verificar se a máquina pode entrar em manutenção
    if (maquina.status === StatusMaquina.MANUTENCAO) {
      throw new Error('Máquina já está em manutenção');
    }

    if (maquina.status === StatusMaquina.INATIVA || maquina.status === StatusMaquina.DESATIVADA) {
      throw new Error('Máquina inativa ou desativada não pode entrar em manutenção');
    }

    // Colocar máquina em manutenção
    const updatedMaquina = await this.maquinasRepository.update(id, {
      status: StatusMaquina.MANUTENCAO,
    });

    return updatedMaquina;
  }
}
