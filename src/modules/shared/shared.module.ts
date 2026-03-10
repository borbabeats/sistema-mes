import { Module, Global } from '@nestjs/common';
import { MaquinasRepository } from '../../infrastructure/repositories/maquinas/maquinas.repository';
import { ManutencoesRepository } from '../../infrastructure/repositories/manutencoes/manutencoes.repository';
import { MAQUINAS_REPOSITORY_TOKEN } from '../../domain/repositories/maquinas.repository.interface';
import { MANUTENCOES_REPOSITORY_TOKEN } from '../../domain/repositories/manutencoes.repository.interface';

@Global()
@Module({
  providers: [
    {
      provide: MAQUINAS_REPOSITORY_TOKEN,
      useClass: MaquinasRepository,
    },
    {
      provide: MANUTENCOES_REPOSITORY_TOKEN,
      useClass: ManutencoesRepository,
    },
  ],
  exports: [
    MAQUINAS_REPOSITORY_TOKEN,
    MANUTENCOES_REPOSITORY_TOKEN,
  ],
})
export class SharedModule {}
