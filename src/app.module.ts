import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { SetoresModule } from './setores/setores.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, SetoresModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
