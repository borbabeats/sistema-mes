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
import { CreateUsuarioDto } from '../../presentation/dto/usuarios/create-usuario.dto';
import { UpdateUsuarioDto } from '../../presentation/dto/usuarios/update-usuario.dto';
import { UsuarioResponseDto } from '../../presentation/dto/usuarios/usuario-response.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('usuarios')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private isAdmin(user: any): boolean {
    return user.cargo === 'ADMIN';
  }

  @Post()
  async create(
    @Body() createUserDto: CreateUsuarioDto,
    @Request() req,
  ): Promise<UsuarioResponseDto> {
    if (!this.isAdmin(req.user)) {
      throw new ForbiddenException(
        'Apenas administradores podem criar usuários',
      );
    }
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(@Request() req): Promise<UsuarioResponseDto[]> {
    if (!this.isAdmin(req.user)) {
      throw new ForbiddenException(
        'Apenas administradores podem listar usuários',
      );
    }
    return this.usersService.findAll();
  }

  @Get('profile/me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req): Promise<UsuarioResponseDto> {
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
  async findOne(
    @Param('id') id: string,
    @Request() req,
  ): Promise<UsuarioResponseDto> {
    // Permite que usuários vejam apenas seus próprios dados, a menos que sejam ADMIN
    if (req.user.cargo !== 'ADMIN' && req.user.id !== parseInt(id)) {
      throw new ForbiddenException(
        'Você só pode visualizar seus próprios dados',
      );
    }
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @Request() req,
  ) {
    // Apenas ADMIN pode atualizar outros usuários
    if (req.user.cargo !== 'ADMIN' && req.user.id !== parseInt(id)) {
      throw new ForbiddenException(
        'Você só pode atualizar seus próprios dados',
      );
    }

    // Apenas ADMIN pode alterar o cargo
    if (updateUsuarioDto.cargo && req.user.cargo !== 'ADMIN') {
      throw new ForbiddenException(
        'Apenas administradores podem alterar cargos',
      );
    }

    return this.usersService.update(+id, updateUsuarioDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    if (!this.isAdmin(req.user)) {
      throw new ForbiddenException(
        'Apenas administradores podem remover usuários',
      );
    }
    return this.usersService.remove(+id);
  }
}
