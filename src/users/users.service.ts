import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await this.hashPassword(createUserDto.senha);
    
    return this.prisma.usuario.create({
      data: {
        ...createUserDto,
        senha: hashedPassword,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        cargo: true,
        telefone: true,
        photo_profile: true,
        setor_id: true,
      },
    });
  }

  async findAll() {
    return this.prisma.usuario.findMany({
      where: {
        deleted_at: null,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        cargo: true,
        telefone: true,
        photo_profile: true,
        setor_id: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.usuario.findFirst({
      where: { 
        AND: [
          { id },
          { deleted_at: null },
        ],
       },
      select: {
        id: true,
        nome: true,
        email: true,
        cargo: true,
        telefone: true,
        photo_profile: true,
        setor_id: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // Verifica se o usuário existe
    await this.findOne(id);

    const data: any = { ...updateUserDto };

    if (updateUserDto.senha) {
      data.senha = await this.hashPassword(updateUserDto.senha);
    }

    return this.prisma.usuario.update({
      where: { id, deleted_at: null },
      data,
      select: {
        id: true,
        nome: true,
        email: true,
        cargo: true,
        telefone: true,
        photo_profile: true,
        setor: {
          select: {
            id: true,
            nome: true,
          }
        }
      },
    });
  }

  async remove(id: number) {
    // Verifica se o usuário existe
    await this.findOne(id);

    return this.prisma.usuario.update({
      where: { id, deleted_at: null },
      data: {
        deleted_at: new Date(),
      },
      select: {
        id: true,
        nome: true,
        email: true
      }
    });
  }

  // Método existente
  async findByEmail(email: string) {
    return this.prisma.usuario.findFirst({
      where: { email, deleted_at: null },
    });
  }
}
