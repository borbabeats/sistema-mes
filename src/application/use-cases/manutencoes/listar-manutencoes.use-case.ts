import { Injectable, Inject } from '@nestjs/common';
import {
  IManutencoesRepository,
  MANUTENCOES_REPOSITORY_TOKEN,
} from '../../../domain/repositories/manutencoes.repository.interface';
import {
  Manutencao,
  StatusManutencao,
} from '../../../domain/entities/manutencao.entity';

@Injectable()
export class ListarManutencoesUseCase {
  constructor(
    @Inject(MANUTENCOES_REPOSITORY_TOKEN)
    private readonly manutencoesRepository: IManutencoesRepository,
  ) {}

  async execute(filters?: {
    maquinaId?: number;
    status?: StatusManutencao;
    responsavelId?: number;
    dataInicio?: Date;
    dataFim?: Date;
    page?: number;
    limit?: number;
  }): Promise<{ data: Manutencao[]; total: number }> {
    return this.manutencoesRepository.findAll(filters);
  }

  async findByMaquina(maquinaId: number): Promise<Manutencao[]> {
    return this.manutencoesRepository.findByMaquina(maquinaId);
  }

  async findAgendadas(): Promise<Manutencao[]> {
    return this.manutencoesRepository.findAgendadas();
  }

  async findAgendadasPaginated(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Manutencao[]; total: number }> {
    return this.manutencoesRepository.findAgendadasPaginated(page, limit);
  }

  async findEmAndamento(): Promise<Manutencao[]> {
    return this.manutencoesRepository.findEmAndamento();
  }

  async findEmAndamentoPaginated(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Manutencao[]; total: number }> {
    return this.manutencoesRepository.findEmAndamentoPaginated(page, limit);
  }

  async findAtrasadas(): Promise<Manutencao[]> {
    return this.manutencoesRepository.findAtrasadas();
  }

  async findAtrasadasPaginated(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Manutencao[]; total: number }> {
    return this.manutencoesRepository.findAtrasadasPaginated(page, limit);
  }
}
