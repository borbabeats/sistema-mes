import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ForbiddenException,
  HttpCode,
} from '@nestjs/common';
import { SetoresService } from './setores.service';
import { CreateSetorDto } from './dto/create-setor.dto';
import { UpdateSetorDto } from './dto/update-setor.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('setores')
@UseGuards(JwtAuthGuard)
export class SetoresController {
  constructor(private readonly setoresService: SetoresService) {}

  @Post()
  create(@Body() createSetorDto: CreateSetorDto, @Request() req) {
    // Apenas administradores podem criar setores
    if (req.user.cargo !== 'ADMIN') {
      throw new ForbiddenException(
        'Apenas administradores podem criar setores',
      );
    }
    return this.setoresService.create(createSetorDto);
  }

  @Get()
  findAll() {
    return this.setoresService.findAll();
  }

  @Get('deleted')
  @UseGuards(JwtAuthGuard)
  async findDeleted(@Request() req) {
    if (req.user.cargo !== 'ADMIN') {
      throw new ForbiddenException(
        'Apenas administradores podem visualizar setores deletados',
      );
    }
    return this.setoresService.findDeleted();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setoresService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSetorDto: UpdateSetorDto,
    @Request() req,
  ) {
    // Apenas administradores podem atualizar setores
    if (req.user.cargo !== 'ADMIN') {
      throw new ForbiddenException(
        'Apenas administradores podem atualizar setores',
      );
    }
    return this.setoresService.update(+id, updateSetorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    // Apenas administradores podem remover setores
    if (req.user.cargo !== 'ADMIN') {
      throw new ForbiddenException(
        'Apenas administradores podem remover setores',
      );
    }
    return this.setoresService.remove(+id);
  }

  @Patch(':id/restore')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async restore(@Param('id') id: string, @Request() req) {
    if (req.user.cargo !== 'ADMIN') {
      throw new ForbiddenException(
        'Apenas administradores podem restaurar setores',
      );
    }
    return this.setoresService.restore(+id);
  }

}
