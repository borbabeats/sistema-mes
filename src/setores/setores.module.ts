import { Module } from '@nestjs/common';
import { SetoresService } from './setores.service';
import { SetoresController } from './setores.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SetoresRepository } from '../infrastructure/repositories/setores/setores.repository';
import { SETORES_REPOSITORY_TOKEN } from './constants';

@Module({
  imports: [PrismaModule],
  controllers: [SetoresController],
  providers: [
    SetoresService,
    {
      provide: SETORES_REPOSITORY_TOKEN,
      useClass: SetoresRepository,
    },
  ],
  exports: [SetoresService, SETORES_REPOSITORY_TOKEN],
})
export class SetoresModule {}
export { SETORES_REPOSITORY_TOKEN };
