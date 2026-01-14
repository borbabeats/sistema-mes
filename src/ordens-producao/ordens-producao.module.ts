import { Module } from '@nestjs/common';
import { OrdensProducaoService } from './ordens-producao.service';
import { OrdensProducaoController } from './ordens-producao.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SetoresModule } from '../setores/setores.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PrismaModule, SetoresModule, UsersModule],
  controllers: [OrdensProducaoController],
  providers: [OrdensProducaoService],
  exports: [OrdensProducaoService],
})
export class OrdensProducaoModule {}