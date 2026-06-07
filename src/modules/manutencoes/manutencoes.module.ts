import { Module } from '@nestjs/common';
import {
  IManutencoesRepository,
  MANUTENCOES_REPOSITORY_TOKEN,
} from '../../domain/repositories/manutencoes.repository.interface';
import { ListarManutencoesUseCase } from '../../application/use-cases/manutencoes/listar-manutencoes.use-case';
import { AgendarManutencaoUseCase } from '../../application/use-cases/manutencoes/agendar-manutencao.use-case';
import { CancelarManutencaoUseCase } from '../../application/use-cases/manutencoes/cancelar-manutencao.use-case';
import { ManutencoesController } from './manutencoes.controller';
import { ManutencoesService } from './manutencoes.service';
import { NotificacoesModule } from '../notificacoes/notificacoes.module';

@Module({
  imports: [NotificacoesModule],
  controllers: [ManutencoesController],
  providers: [
    ManutencoesService,
    ListarManutencoesUseCase,
    AgendarManutencaoUseCase,
    CancelarManutencaoUseCase,
  ],
  exports: [
    ManutencoesService,
    ListarManutencoesUseCase,
    AgendarManutencaoUseCase,
    CancelarManutencaoUseCase,
  ],
})
export class ManutencoesModule {}
