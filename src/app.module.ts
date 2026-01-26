import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { SetoresModule } from './modules/setores/setores.module';
import { OrdensProducaoModule } from './modules/ordens-producao/ordens-producao.module';
import { ApontamentosModule } from './modules/apontamentos/apontamentos.module';
import { MaquinasModule } from './modules/maquinas/maquinas.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [LoggerModule, PrismaModule, AuthModule, UsersModule, SetoresModule, OrdensProducaoModule, ApontamentosModule, MaquinasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
