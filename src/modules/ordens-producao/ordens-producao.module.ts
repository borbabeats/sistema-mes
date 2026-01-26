import { Module } from '@nestjs/common';
import { OrdensProducaoService } from './ordens-producao.service';
import { OrdensProducaoController } from './ordens-producao.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { SetoresModule } from '../setores/setores.module';
import { UsersModule } from '../users/users.module';
import { OrdensProducaoRepository } from '../../infrastructure/repositories/ordens-producao/ordens-producao.repository';
import { LoggerModule } from '../../logger/logger.module';
import { ORDENS_PRODUCAO_REPOSITORY_TOKEN } from './constants';
import { CreateOrdemProducaoUseCase } from '../../application/use-cases/ordens-producao/create-ordem-producao.use-case';
import { FindOrdemProducaoUseCase } from '../../application/use-cases/ordens-producao/find-ordem-producao.use-case';
import { FindAllOrdensProducaoUseCase } from '../../application/use-cases/ordens-producao/find-all-ordens-producao.use-case';
import { UpdateOrdemProducaoUseCase } from '../../application/use-cases/ordens-producao/update-ordem-producao.use-case';
import { DeleteOrdemProducaoUseCase } from '../../application/use-cases/ordens-producao/delete-ordem-producao.use-case';
import { IniciarProducaoUseCase } from '../../application/use-cases/ordens-producao/iniciar-producao.use-case';
import { PausarProducaoUseCase } from '../../application/use-cases/ordens-producao/pausar-producao.use-case';
import { RetomarProducaoUseCase } from '../../application/use-cases/ordens-producao/retomar-producao.use-case';
import { FinalizarProducaoUseCase } from '../../application/use-cases/ordens-producao/finalizar-producao.use-case';
import { CancelarProducaoUseCase } from '../../application/use-cases/ordens-producao/cancelar-producao.use-case';
import { UpdateQuantidadeProduzidaUseCase } from '../../application/use-cases/ordens-producao/update-quantidade-produzida.use-case';
import { FindByCodigoUseCase } from '../../application/use-cases/ordens-producao/find-by-codigo.use-case';
import { FindByStatusUseCase } from '../../application/use-cases/ordens-producao/find-by-status.use-case';
import { FindByPrioridadeUseCase } from '../../application/use-cases/ordens-producao/find-by-prioridade.use-case';
import { FindBySetorUseCase } from '../../application/use-cases/ordens-producao/find-by-setor.use-case';
import { FindByResponsavelUseCase } from '../../application/use-cases/ordens-producao/find-by-responsavel.use-case';
import { FindOverdueUseCase } from '../../application/use-cases/ordens-producao/find-overdue.use-case';
import { FindPendingUseCase } from '../../application/use-cases/ordens-producao/find-pending.use-case';

@Module({
  imports: [PrismaModule, SetoresModule, UsersModule, LoggerModule],
  controllers: [OrdensProducaoController],
  providers: [
    OrdensProducaoService,
    CreateOrdemProducaoUseCase,
    FindOrdemProducaoUseCase,
    FindAllOrdensProducaoUseCase,
    UpdateOrdemProducaoUseCase,
    DeleteOrdemProducaoUseCase,
    IniciarProducaoUseCase,
    PausarProducaoUseCase,
    RetomarProducaoUseCase,
    FinalizarProducaoUseCase,
    CancelarProducaoUseCase,
    UpdateQuantidadeProduzidaUseCase,
    FindByCodigoUseCase,
    FindByStatusUseCase,
    FindByPrioridadeUseCase,
    FindBySetorUseCase,
    FindByResponsavelUseCase,
    FindOverdueUseCase,
    FindPendingUseCase,
    {
      provide: ORDENS_PRODUCAO_REPOSITORY_TOKEN,
      useClass: OrdensProducaoRepository,
    },
  ],
  exports: [OrdensProducaoService, ORDENS_PRODUCAO_REPOSITORY_TOKEN, CreateOrdemProducaoUseCase, FindOrdemProducaoUseCase, FindAllOrdensProducaoUseCase, UpdateOrdemProducaoUseCase, DeleteOrdemProducaoUseCase, IniciarProducaoUseCase, PausarProducaoUseCase, RetomarProducaoUseCase, FinalizarProducaoUseCase, CancelarProducaoUseCase, UpdateQuantidadeProduzidaUseCase, FindByCodigoUseCase, FindByStatusUseCase, FindByPrioridadeUseCase, FindBySetorUseCase, FindByResponsavelUseCase, FindOverdueUseCase, FindPendingUseCase],
})
export class OrdensProducaoModule {}