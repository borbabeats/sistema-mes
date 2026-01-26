// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UserRepository } from './repositories/user.repository';
import { IUserRepository } from './interfaces/user.repository.interface';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
  ],
  exports: [UsersService, IUserRepository],
})
export class UsersModule {}