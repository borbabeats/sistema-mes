import { Module } from '@nestjs/common';
import { OrdensProducaoService } from './ordens-producao.service';
import { OrdensProducaoController } from './ordens-producao.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { SetoresModule } from '../../modules/setores/setores.module';
import { UsersModule } from '../../modules/users/users.module';
import { OrdensProducaoRepository } from '../../infrastructure/repositories/ordens-producao/ordens-producao.repository';
import { LoggerModule } from '../../logger/logger.module';
import { ORDENS_PRODUCAO_REPOSITORY_TOKEN } from './constants';
import { CreateOrdemProducaoUseCase } from '../../application/use-cases/ordens-producao/create-ordem-producao.use-case';

@Module({
  imports: [PrismaModule, SetoresModule, UsersModule, LoggerModule],
  controllers: [OrdensProducaoController],
  providers: [
    OrdensProducaoService,
    CreateOrdemProducaoUseCase,
    {
      provide: ORDENS_PRODUCAO_REPOSITORY_TOKEN,
      useClass: OrdensProducaoRepository,
    },
  ],
  exports: [OrdensProducaoService, ORDENS_PRODUCAO_REPOSITORY_TOKEN],
})
export class OrdensProducaoModule {}