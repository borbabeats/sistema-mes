import { Module } from '@nestjs/common';
import { MaquinasController } from './maquinas.controller';
import { MaquinasService } from './maquinas.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { MaquinasRepository } from '../../infrastructure/repositories/maquinas/maquinas.repository';
import { MAQUINAS_REPOSITORY_TOKEN } from '../../domain/repositories/maquinas.repository.interface';
import { MANUTENCOES_REPOSITORY_TOKEN } from '../../domain/repositories/manutencoes.repository.interface';
import { SetoresModule } from '../setores/setores.module';
import { ManutencoesModule } from '../manutencoes/manutencoes.module';
import { CreateMaquinaUseCase } from '../../application/use-cases/maquinas/create-maquina.use-case';
import { FindMaquinaUseCase } from '../../application/use-cases/maquinas/find-maquina.use-case';
import { FindAllMaquinasUseCase } from '../../application/use-cases/maquinas/find-all-maquinas.use-case';
import { UpdateMaquinaUseCase } from '../../application/use-cases/maquinas/update-maquina.use-case';
import { DeleteMaquinaUseCase } from '../../application/use-cases/maquinas/delete-maquina.use-case';
import { UpdateStatusMaquinaUseCase } from '../../application/use-cases/maquinas/update-status-maquina.use-case';
import { UpdateHorasUsoUseCase } from '../../application/use-cases/maquinas/update-horas-uso.use-case';
import { IniciarManutencaoUseCase } from '../../application/use-cases/maquinas/iniciar-manutencao.use-case';
import { FinalizarManutencaoUseCase } from '../../application/use-cases/maquinas/finalizar-manutencao.use-case';
import { FindByCodigoUseCase } from '../../application/use-cases/maquinas/find-by-codigo.use-case';
import { FindBySetorUseCase } from '../../application/use-cases/maquinas/find-by-setor.use-case';
import { FindByStatusUseCase } from '../../application/use-cases/maquinas/find-by-status.use-case';
import { FindAvailableUseCase } from '../../application/use-cases/maquinas/find-available.use-case';
import { ListarManutencoesUseCase } from '../../application/use-cases/manutencoes/listar-manutencoes.use-case';

@Module({
  imports: [PrismaModule, SetoresModule],
  controllers: [MaquinasController],
  providers: [
    MaquinasService,
    CreateMaquinaUseCase,
    FindMaquinaUseCase,
    FindAllMaquinasUseCase,
    UpdateMaquinaUseCase,
    DeleteMaquinaUseCase,
    UpdateStatusMaquinaUseCase,
    UpdateHorasUsoUseCase,
    IniciarManutencaoUseCase,
    FinalizarManutencaoUseCase,
    FindByCodigoUseCase,
    FindBySetorUseCase,
    FindByStatusUseCase,
    FindAvailableUseCase,
    ListarManutencoesUseCase,
  ],
  exports: [
    MaquinasService,
    CreateMaquinaUseCase,
    FindMaquinaUseCase,
    FindAllMaquinasUseCase,
    UpdateMaquinaUseCase,
    DeleteMaquinaUseCase,
    UpdateStatusMaquinaUseCase,
    UpdateHorasUsoUseCase,
    IniciarManutencaoUseCase,
    FinalizarManutencaoUseCase,
    FindByCodigoUseCase,
    FindBySetorUseCase,
    FindByStatusUseCase,
    FindAvailableUseCase,
    ListarManutencoesUseCase,
  ],
})
export class MaquinasModule {}
