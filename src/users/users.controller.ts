import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Patch,
  Delete, 
  UseGuards, 
  Request,
  ForbiddenException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Cargo } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private isAdmin(user: any): boolean {
    return user.cargo === 'ADMIN';
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Request() req) {
    if (!this.isAdmin(req.user)) {
      throw new ForbiddenException('Apenas administradores podem criar usuários');
    }
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(@Request() req) {
    if (!this.isAdmin(req.user)) {
      throw new ForbiddenException('Apenas administradores podem listar usuários');
    }
    return this.usersService.findAll();
  }

  @Get('profile/me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    try {
      return await this.usersService.findOne(req.user.id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException('Usuário não encontrado');
      }
      throw new Error(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    // Permite que usuários vejam apenas seus próprios dados, a menos que sejam ADMIN
    if (req.user.cargo !== 'ADMIN' && req.user.id !== parseInt(id)) {
      throw new ForbiddenException('Você só pode visualizar seus próprios dados');
    }
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    // Apenas ADMIN pode atualizar outros usuários
    if (req.user.cargo !== 'ADMIN' && req.user.id !== parseInt(id)) {
      throw new ForbiddenException('Você só pode atualizar seus próprios dados');
    }

    // Apenas ADMIN pode alterar o cargo
    if (updateUserDto.cargo && req.user.cargo !== 'ADMIN') {
      throw new ForbiddenException('Apenas administradores podem alterar cargos');
    }

    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    if (!this.isAdmin(req.user)) {
      throw new ForbiddenException('Apenas administradores podem remover usuários');
    }
    return this.usersService.remove(+id);
  }
}