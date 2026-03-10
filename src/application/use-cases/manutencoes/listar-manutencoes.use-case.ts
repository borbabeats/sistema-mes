import { Injectable, Inject } from '@nestjs/common';
import { IManutencoesRepository, MANUTENCOES_REPOSITORY_TOKEN } from '../../../domain/repositories/manutencoes.repository.interface';
import { Manutencao, StatusManutencao } from '../../../domain/entities/manutencao.entity';

@Injectable()
export class ListarManutencoesUseCase {
  constructor(
    @Inject(MANUTENCOES_REPOSITORY_TOKEN) private readonly manutencoesRepository: IManutencoesRepository,
  ) {}

  async execute(filters?: {
    maquinaId?: number;
    status?: StatusManutencao;
    responsavelId?: number;
    dataInicio?: Date;
    dataFim?: Date;
  }): Promise<Manutencao[]> {
    return this.manutencoesRepository.findAll(filters);
  }

  async findByMaquina(maquinaId: number): Promise<Manutencao[]> {
    return this.manutencoesRepository.findByMaquina(maquinaId);
  }

  async findAgendadas(): Promise<Manutencao[]> {
    return this.manutencoesRepository.findAgendadas();
  }

  async findEmAndamento(): Promise<Manutencao[]> {
    return this.manutencoesRepository.findEmAndamento();
  }

  async findAtrasadas(): Promise<Manutencao[]> {
    return this.manutencoesRepository.findAtrasadas();
  }
}
