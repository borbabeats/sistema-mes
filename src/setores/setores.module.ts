import { Module } from '@nestjs/common';
import { SetoresService } from './setores.service';
import { SetoresController } from './setores.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SetorRepository } from './repositories/setor.repository';
import { ISetorRepository } from './interfaces/setor.repository.interface';

@Module({
  imports: [PrismaModule],
  controllers: [SetoresController],
  providers: [
    SetoresService,
    {
      provide: ISetorRepository,
      useClass: SetorRepository,
    },
  ],
  exports: [SetoresService, ISetorRepository],
})
export class SetoresModule {}
