import { Module } from '@nestjs/common';
import { ApontamentosService } from './apontamentos.service';
import { ApontamentosController } from './apontamentos.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ApontamentosRepository } from './repositories/apontamentos.repository';
import { IApontamentosRepository } from './interfaces/apontamentos.repository.interface';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [PrismaModule, LoggerModule],
  providers: [
    ApontamentosService,
    {
      provide: IApontamentosRepository,
      useClass: ApontamentosRepository,
    },
  ],
  controllers: [ApontamentosController],
  exports: [ApontamentosService, IApontamentosRepository],
})
export class ApontamentosModule {}
