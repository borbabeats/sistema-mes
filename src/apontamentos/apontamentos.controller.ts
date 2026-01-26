import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ApontamentosService } from './apontamentos.service';
import { CreateApontamentoDto } from '../presentation/dto/apontamentos/create-apontamento.dto';
import { UpdateApontamentoDto } from '../presentation/dto/apontamentos/update-apontamento.dto';
import { FinalizeApontamentoDto } from '../presentation/dto/apontamentos/finalize-apontamento.dto';
import { Apontamento } from '../domain/entities/apontamento.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@ApiTags('apontamentos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('apontamentos')
export class ApontamentosController {
  constructor(private readonly apontamentosService: ApontamentosService) {}

  @Post()
  @Roles(Role.ADMIN, Role.GERENTE, Role.OPERADOR)
  @ApiOperation({ summary: 'Criar um novo apontamento' })
  @ApiResponse({ status: 201, description: 'Apontamento criado com sucesso', type: Apontamento })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() createApontamentoDto: CreateApontamentoDto): Promise<Apontamento> {
    return this.apontamentosService.create(createApontamentoDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.GERENTE, Role.OPERADOR)
  @ApiOperation({ summary: 'Listar todos os apontamentos' })
  @ApiResponse({ status: 200, description: 'Lista de apontamentos', type: [Apontamento] })
  findAll(@Query() filters?: any): Promise<Apontamento[]> {
    return this.apontamentosService.findAll(filters);
  }

  @Get('maquina/:maquinaId')
  @Roles(Role.ADMIN, Role.GERENTE, Role.OPERADOR)
  @ApiOperation({ summary: 'Listar apontamentos de uma máquina' })
  @ApiResponse({ status: 200, description: 'Lista de apontamentos', type: [Apontamento] })
  findByMaquina(@Param('maquinaId', ParseIntPipe) maquinaId: number): Promise<Apontamento[]> {
    return this.apontamentosService.findByMaquina(maquinaId);
  }

  @Get('usuario/:usuarioId')
  @Roles(Role.ADMIN, Role.GERENTE, Role.OPERADOR)
  @ApiOperation({ summary: 'Listar apontamentos de um usuário' })
  @ApiResponse({ status: 200, description: 'Lista de apontamentos', type: [Apontamento] })
  findByUsuario(@Param('usuarioId', ParseIntPipe) usuarioId: number): Promise<Apontamento[]> {
    return this.apontamentosService.findByUsuario(usuarioId);
  }

  @Get('ordem-producao/:opId')
  @Roles(Role.ADMIN, Role.GERENTE, Role.OPERADOR)
  @ApiOperation({ summary: 'Listar apontamentos de uma ordem de produção' })
  @ApiResponse({ status: 200, description: 'Lista de apontamentos', type: [Apontamento] })
  findByOrdemProducao(@Param('opId', ParseIntPipe) opId: number): Promise<Apontamento[]> {
    return this.apontamentosService.findByOrdemProducao(opId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.GERENTE, Role.OPERADOR)
  @ApiOperation({ summary: 'Obter um apontamento pelo ID' })
  @ApiResponse({ status: 200, description: 'Apontamento encontrado', type: Apontamento })
  @ApiResponse({ status: 404, description: 'Apontamento não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Apontamento> {
    return this.apontamentosService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.GERENTE, Role.OPERADOR)
  @ApiOperation({ summary: 'Atualizar um apontamento' })
  @ApiResponse({ status: 200, description: 'Apontamento atualizado', type: Apontamento })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Apontamento não encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateApontamentoDto: UpdateApontamentoDto,
  ): Promise<Apontamento> {
    return this.apontamentosService.update(id, updateApontamentoDto);
  }

  @Post(':id/finalize')
  @Roles(Role.ADMIN, Role.GERENTE, Role.OPERADOR)
  @ApiOperation({ summary: 'Finalizar um apontamento' })
  @ApiResponse({ status: 200, description: 'Apontamento finalizado', type: Apontamento })
  @ApiResponse({ status: 404, description: 'Apontamento não encontrado' })
  finalize(
    @Param('id', ParseIntPipe) id: number,
    @Body() finalizeApontamentoDto: FinalizeApontamentoDto,
  ): Promise<Apontamento> {
    return this.apontamentosService.finalizeApontamento(
      id,
      finalizeApontamentoDto.quantidadeProduzida,
      finalizeApontamentoDto.quantidadeDefeito,
    );
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.GERENTE)
  @ApiOperation({ summary: 'Remover um apontamento' })
  @ApiResponse({ status: 200, description: 'Apontamento removido' })
  @ApiResponse({ status: 404, description: 'Apontamento não encontrado' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<Apontamento> {
    return this.apontamentosService.remove(id);
  }
}
