import { Module } from '@nestjs/common';
import { MaquinasService } from './maquinas.service';
import { MaquinasController } from './maquinas.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MaquinaRepository } from './repositories/maquina.repository';
import { IMaquinaRepository } from './interfaces/maquina.repository.interface';

@Module({
  imports: [PrismaModule],
  controllers: [MaquinasController],
  providers: [
    MaquinasService,
    {
      provide: IMaquinaRepository,
      useClass: MaquinaRepository,
    },
  ],
  exports: [MaquinasService, IMaquinaRepository],
})
export class MaquinasModule {}
