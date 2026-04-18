import { Module } from '@nestjs/common';
import { SetoresService } from './setores.service';
import { SetoresController } from './setores.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { SetoresRepository } from '../../infrastructure/repositories/setores/setores.repository';
import { SETORES_REPOSITORY_TOKEN } from './constants';
import { CreateSetorUseCase } from '../../application/use-cases/setores/create-setor.use-case';
import { FindSetorUseCase } from '../../application/use-cases/setores/find-setor.use-case';
import { FindAllSetoresUseCase } from '../../application/use-cases/setores/find-all-setores.use-case';
import { UpdateSetorUseCase } from '../../application/use-cases/setores/update-setor.use-case';
import { DeleteSetorUseCase } from '../../application/use-cases/setores/delete-setor.use-case';

@Module({
  imports: [PrismaModule],
  controllers: [SetoresController],
  providers: [
    SetoresService,
    CreateSetorUseCase,
    FindSetorUseCase,
    FindAllSetoresUseCase,
    UpdateSetorUseCase,
    DeleteSetorUseCase,
    {
      provide: SETORES_REPOSITORY_TOKEN,
      useClass: SetoresRepository,
    },
  ],
  exports: [
    SetoresService,
    SETORES_REPOSITORY_TOKEN,
    CreateSetorUseCase,
    FindSetorUseCase,
    FindAllSetoresUseCase,
    UpdateSetorUseCase,
    DeleteSetorUseCase,
  ],
})
export class SetoresModule {}
export { SETORES_REPOSITORY_TOKEN };
