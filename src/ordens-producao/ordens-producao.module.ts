import { Module } from '@nestjs/common';
import { OrdensProducaoService } from './ordens-producao.service';
import { OrdensProducaoController } from './ordens-producao.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SetoresModule } from '../setores/setores.module';
import { UsersModule } from '../users/users.module';
import { OrdensProducaoRepository } from './repositories/ordens-producao.repository';
import { IOrdensProducaoRepository } from './interfaces/ordens-producao.repository.interface';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [PrismaModule, SetoresModule, UsersModule, LoggerModule],
  controllers: [OrdensProducaoController],
  providers: [
    OrdensProducaoService,
    {
      provide: IOrdensProducaoRepository,
      useClass: OrdensProducaoRepository,
    },
  ],
  exports: [OrdensProducaoService, IOrdensProducaoRepository],
})
export class OrdensProducaoModule {}