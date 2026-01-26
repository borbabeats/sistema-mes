// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { UsuariosRepository } from '../../infrastructure/repositories/usuarios/usuarios.repository';
import { USUARIOS_REPOSITORY_TOKEN } from './constants';
import { CreateUsuarioUseCase } from '../../application/use-cases/usuarios/create-usuario.use-case';
import { FindUsuarioUseCase } from '../../application/use-cases/usuarios/find-usuario.use-case';
import { FindAllUsuariosUseCase } from '../../application/use-cases/usuarios/find-all-usuarios.use-case';
import { UpdateUsuarioUseCase } from '../../application/use-cases/usuarios/update-usuario.use-case';
import { DeleteUsuarioUseCase } from '../../application/use-cases/usuarios/delete-usuario.use-case';
import { AuthenticateUsuarioUseCase } from '../../application/use-cases/usuarios/authenticate-usuario.use-case';
import { SetoresModule } from '../setores/setores.module';

@Module({
  imports: [PrismaModule, SetoresModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    CreateUsuarioUseCase,
    FindUsuarioUseCase,
    FindAllUsuariosUseCase,
    UpdateUsuarioUseCase,
    DeleteUsuarioUseCase,
    AuthenticateUsuarioUseCase,
    {
      provide: USUARIOS_REPOSITORY_TOKEN,
      useClass: UsuariosRepository,
    },
  ],
  exports: [
    UsersService, 
    USUARIOS_REPOSITORY_TOKEN,
    CreateUsuarioUseCase,
    FindUsuarioUseCase,
    FindAllUsuariosUseCase,
    UpdateUsuarioUseCase,
    DeleteUsuarioUseCase,
    AuthenticateUsuarioUseCase,
  ],
})
export class UsersModule {}
export { USUARIOS_REPOSITORY_TOKEN };