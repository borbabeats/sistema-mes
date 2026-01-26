import { Module } from '@nestjs/common';
import { ApontamentosService } from './apontamentos.service';
import { ApontamentosController } from './apontamentos.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { ApontamentosRepository } from '../../infrastructure/repositories/apontamentos/apontamentos.repository';
import { IApontamentosRepository, APONTAMENTOS_REPOSITORY_TOKEN } from '../../domain/repositories/apontamentos.repository.interface';
import { LoggerModule } from '../../logger/logger.module';
import { CreateApontamentoUseCase } from '../../application/use-cases/apontamentos/create-apontamento.use-case';
import { FinalizeApontamentoUseCase } from '../../application/use-cases/apontamentos/finalize-apontamento.use-case';
import { MaquinasModule } from '../maquinas/maquinas.module';
import { OrdensProducaoModule } from '../ordens-producao/ordens-producao.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PrismaModule, LoggerModule, MaquinasModule, OrdensProducaoModule, UsersModule],
  providers: [
    ApontamentosService,
    {
      provide: APONTAMENTOS_REPOSITORY_TOKEN,
      useClass: ApontamentosRepository,
    },
    CreateApontamentoUseCase,
    FinalizeApontamentoUseCase,
  ],
  controllers: [ApontamentosController],
  exports: [ApontamentosService],
})
export class ApontamentosModule {}
