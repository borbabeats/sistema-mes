// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UsuariosRepository } from '../infrastructure/repositories/usuarios/usuarios.repository';
import { USUARIOS_REPOSITORY_TOKEN } from './constants';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: USUARIOS_REPOSITORY_TOKEN,
      useClass: UsuariosRepository,
    },
  ],
  exports: [UsersService, USUARIOS_REPOSITORY_TOKEN],
})
export class UsersModule {}
export { USUARIOS_REPOSITORY_TOKEN };