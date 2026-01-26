import { Injectable, Inject } from '@nestjs/common';
import { IMaquinasRepository } from '../../../domain/repositories/maquinas.repository.interface';
import { Maquina, StatusMaquina } from '../../../domain/entities/maquina.entity';
import { MAQUINAS_REPOSITORY_TOKEN } from '../../../domain/repositories/maquinas.repository.interface';

@Injectable()
export class UpdateStatusMaquinaUseCase {
  constructor(
    @Inject(MAQUINAS_REPOSITORY_TOKEN) private readonly maquinasRepository: IMaquinasRepository,
  ) {}

  async execute(id: number, status: StatusMaquina, motivo?: string): Promise<Maquina> {
    // Verificar se a máquina existe
    const maquina = await this.maquinasRepository.findOne(id);
    if (!maquina) {
      throw new Error('Máquina não encontrada');
    }

    // Validar status
    if (!Object.values(StatusMaquina).includes(status)) {
      throw new Error('Status inválido');
    }

    // Validações de transição de status
    if (maquina.status === StatusMaquina.INATIVA && status !== StatusMaquina.DISPONIVEL) {
      throw new Error('Máquina inativa só pode ser reativada para status DISPONIVEL');
    }

    if (maquina.status === StatusMaquina.DESATIVADA && status !== StatusMaquina.DISPONIVEL) {
      throw new Error('Máquina desativada só pode ser reativada para status DISPONIVEL');
    }

    // Atualizar status
    const updatedMaquina = await this.maquinasRepository.update(id, { status });

    return updatedMaquina;
  }
}
