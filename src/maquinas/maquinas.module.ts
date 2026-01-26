import { Module } from '@nestjs/common';
import { CreateMaquinaUseCase } from '../application/use-cases/maquinas/create-maquina.use-case';
import { MaquinasController } from './maquinas.controller';
import { MaquinasService } from './maquinas.service';
import { PrismaModule } from '../prisma/prisma.module';
import { MaquinasRepository } from '../infrastructure/repositories/maquinas/maquinas.repository';
import { MAQUINAS_REPOSITORY_TOKEN } from '../domain/repositories/maquinas.repository.interface';
import { SetoresModule } from '../setores/setores.module';


@Module({
  imports: [PrismaModule, SetoresModule],
  controllers: [MaquinasController],
  providers: [
    MaquinasService,
    CreateMaquinaUseCase,
    {
      provide: MAQUINAS_REPOSITORY_TOKEN,
      useClass: MaquinasRepository,
    },
  ],
  exports: [MaquinasService, CreateMaquinaUseCase, MAQUINAS_REPOSITORY_TOKEN],
})
export class MaquinasModule {}
