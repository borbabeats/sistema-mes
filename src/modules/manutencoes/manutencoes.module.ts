import { Module } from '@nestjs/common';
import {
  IManutencoesRepository,
  MANUTENCOES_REPOSITORY_TOKEN,
} from '../../domain/repositories/manutencoes.repository.interface';
import { ListarManutencoesUseCase } from '../../application/use-cases/manutencoes/listar-manutencoes.use-case';
import { AgendarManutencaoUseCase } from '../../application/use-cases/manutencoes/agendar-manutencao.use-case';
import { CancelarManutencaoUseCase } from '../../application/use-cases/manutencoes/cancelar-manutencao.use-case';
import { ManutencoesController } from './manutencoes.controller';

@Module({
  controllers: [ManutencoesController],
  providers: [
    ListarManutencoesUseCase,
    AgendarManutencaoUseCase,
    CancelarManutencaoUseCase,
  ],
  exports: [
    ListarManutencoesUseCase,
    AgendarManutencaoUseCase,
    CancelarManutencaoUseCase,
  ],
})
export class ManutencoesModule {}
