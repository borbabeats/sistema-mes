import { Module, forwardRef } from '@nestjs/common';
import { ApontamentosService } from './apontamentos.service';
import { ApontamentosController } from './apontamentos.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { ApontamentosRepository } from '../../infrastructure/repositories/apontamentos/apontamentos.repository';
import { IApontamentosRepository, APONTAMENTOS_REPOSITORY_TOKEN } from '../../domain/repositories/apontamentos.repository.interface';
import { LoggerModule } from '../../logger/logger.module';
import { CreateApontamentoUseCase } from '../../application/use-cases/apontamentos/create-apontamento.use-case';
import { FinalizeApontamentoUseCase } from '../../application/use-cases/apontamentos/finalize-apontamento.use-case';
import { FindApontamentoUseCase } from '../../application/use-cases/apontamentos/find-apontamento.use-case';
import { FindAllApontamentosUseCase } from '../../application/use-cases/apontamentos/find-all-apontamentos.use-case';
import { UpdateApontamentoUseCase } from '../../application/use-cases/apontamentos/update-apontamento.use-case';
import { DeleteApontamentoUseCase } from '../../application/use-cases/apontamentos/delete-apontamento.use-case';
import { FindByMaquinaUseCase } from '../../application/use-cases/apontamentos/find-by-maquina.use-case';
import { FindByUsuarioUseCase } from '../../application/use-cases/apontamentos/find-by-usuario.use-case';
import { FindByOrdemProducaoUseCase } from '../../application/use-cases/apontamentos/find-by-ordem-producao.use-case';
import { FindByPeriodoUseCase } from '../../application/use-cases/apontamentos/find-by-periodo.use-case';
import { FindAllApontamentosPaginatedUseCase } from '../../application/use-cases/apontamentos/find-all-apontamentos-paginated.use-case';
import { MaquinasModule } from '../maquinas/maquinas.module';
import { OrdensProducaoModule } from '../ordens-producao/ordens-producao.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PrismaModule, LoggerModule, MaquinasModule, forwardRef(() => OrdensProducaoModule), UsersModule],
  providers: [
    ApontamentosService,
    {
      provide: APONTAMENTOS_REPOSITORY_TOKEN,
      useClass: ApontamentosRepository,
    },
    CreateApontamentoUseCase,
    FinalizeApontamentoUseCase,
    FindApontamentoUseCase,
    FindAllApontamentosUseCase,
    UpdateApontamentoUseCase,
    DeleteApontamentoUseCase,
    FindByMaquinaUseCase,
    FindByUsuarioUseCase,
    FindByOrdemProducaoUseCase,
    FindByPeriodoUseCase,
    FindAllApontamentosPaginatedUseCase,
  ],
  controllers: [ApontamentosController],
  exports: [
    ApontamentosService,
    APONTAMENTOS_REPOSITORY_TOKEN,
    CreateApontamentoUseCase,
    FinalizeApontamentoUseCase,
    FindApontamentoUseCase,
    FindAllApontamentosUseCase,
    UpdateApontamentoUseCase,
    DeleteApontamentoUseCase,
    FindByMaquinaUseCase,
    FindByUsuarioUseCase,
    FindByOrdemProducaoUseCase,
    FindByPeriodoUseCase,
    FindAllApontamentosPaginatedUseCase,
  ],
})
export class ApontamentosModule {}
