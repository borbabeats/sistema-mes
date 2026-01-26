import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from './interfaces/user.repository.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Usuario } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: IUserRepository) {}

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async create(createUserDto: CreateUserDto): Promise<Usuario> {
    const hashedPassword = await this.hashPassword(createUserDto.senha);
    
    return this.userRepository.create({
      ...createUserDto,
      senha: hashedPassword,
    });
  }

  async findAll(): Promise<Usuario[]> {
    return this.userRepository.findAll();
  }

  async findOne(id: number): Promise<Usuario> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<Usuario> {
    await this.findOne(id);

    const data: Partial<Usuario> = { 
      ...updateUserDto,
    };

    if (updateUserDto.senha) {
      data.senha = await this.hashPassword(updateUserDto.senha);
    }

    return this.userRepository.update(id, data);
  }

  async remove(id: number): Promise<Usuario> {
    await this.findOne(id);

    return this.userRepository.remove(id);
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.userRepository.findByEmail(email);
  }
}
