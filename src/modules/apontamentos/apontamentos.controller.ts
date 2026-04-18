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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ApontamentosService } from './apontamentos.service';
import { CreateApontamentoDto } from '../../presentation/dto/apontamentos/create-apontamento.dto';
import { UpdateApontamentoDto } from '../../presentation/dto/apontamentos/update-apontamento.dto';
import { FinalizeApontamentoDto } from '../../presentation/dto/apontamentos/finalize-apontamento.dto';
import { FindAllApontamentosDto } from '../../presentation/dto/apontamentos/find-all-apontamentos.dto';
import { Apontamento } from '../../domain/entities/apontamento.entity';
import { PaginatedResult } from '../../presentation/dto/common/pagination.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { Role } from '../../auth/role.enum';

@ApiTags('apontamentos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('apontamentos')
export class ApontamentosController {
  constructor(private readonly apontamentosService: ApontamentosService) {}

  @Post()
  @Roles(Role.ADMIN, Role.GERENTE, Role.OPERADOR)
  @ApiOperation({ summary: 'Criar um novo apontamento' })
  @ApiResponse({
    status: 201,
    description: 'Apontamento criado com sucesso',
    type: Apontamento,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(
    @Body() createApontamentoDto: CreateApontamentoDto,
  ): Promise<Apontamento> {
    return this.apontamentosService.create(createApontamentoDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.GERENTE, Role.OPERADOR)
  @ApiOperation({
    summary: 'Listar todos os apontamentos com filtros e paginação',
  })
  @ApiResponse({ status: 200, description: 'Lista paginada de apontamentos' })
  findAll(
    @Query() filters: FindAllApontamentosDto,
  ): Promise<PaginatedResult<Apontamento>> {
    return this.apontamentosService.findAllPaginated(filters);
  }

  @Get('maquina/:maquinaId')
  @Roles(Role.ADMIN, Role.GERENTE, Role.OPERADOR)
  @ApiOperation({ summary: 'Listar apontamentos de uma máquina com paginação' })
  @ApiResponse({ status: 200, description: 'Lista paginada de apontamentos' })
  findByMaquina(
    @Param('maquinaId', ParseIntPipe) maquinaId: number,
    @Query()
    pagination: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
    },
  ): Promise<PaginatedResult<Apontamento>> {
    const filters = new FindAllApontamentosDto();
    filters.maquinaId = maquinaId;
    filters.page = pagination.page || 1;
    filters.limit = pagination.limit || 20;
    filters.sortBy = pagination.sortBy;
    filters.sortOrder = pagination.sortOrder || 'DESC';

    return this.apontamentosService.findAllPaginated(filters);
  }

  @Get('usuario/:usuarioId')
  @Roles(Role.ADMIN, Role.GERENTE, Role.OPERADOR)
  @ApiOperation({ summary: 'Listar apontamentos de um usuário com paginação' })
  @ApiResponse({ status: 200, description: 'Lista paginada de apontamentos' })
  findByUsuario(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Query()
    pagination: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
    },
  ): Promise<PaginatedResult<Apontamento>> {
    const filters = new FindAllApontamentosDto();
    filters.usuarioId = usuarioId;
    filters.page = pagination.page || 1;
    filters.limit = pagination.limit || 20;
    filters.sortBy = pagination.sortBy;
    filters.sortOrder = pagination.sortOrder || 'DESC';

    return this.apontamentosService.findAllPaginated(filters);
  }

  @Get('ordem-producao/:opId')
  @Roles(Role.ADMIN, Role.GERENTE, Role.OPERADOR)
  @ApiOperation({
    summary: 'Listar apontamentos de uma ordem de produção com paginação',
  })
  @ApiResponse({ status: 200, description: 'Lista paginada de apontamentos' })
  findByOrdemProducao(
    @Param('opId', ParseIntPipe) opId: number,
    @Query()
    pagination: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
    },
  ): Promise<PaginatedResult<Apontamento>> {
    const filters = new FindAllApontamentosDto();
    filters.opId = opId;
    filters.page = pagination.page || 1;
    filters.limit = pagination.limit || 20;
    filters.sortBy = pagination.sortBy;
    filters.sortOrder = pagination.sortOrder || 'DESC';

    return this.apontamentosService.findAllPaginated(filters);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.GERENTE, Role.OPERADOR)
  @ApiOperation({ summary: 'Obter um apontamento pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'Apontamento encontrado',
    type: Apontamento,
  })
  @ApiResponse({ status: 404, description: 'Apontamento não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Apontamento> {
    return this.apontamentosService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.GERENTE, Role.OPERADOR)
  @ApiOperation({ summary: 'Atualizar um apontamento' })
  @ApiResponse({
    status: 200,
    description: 'Apontamento atualizado',
    type: Apontamento,
  })
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
  @ApiResponse({
    status: 200,
    description: 'Apontamento finalizado',
    type: Apontamento,
  })
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
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string; id: number }> {
    return this.apontamentosService.remove(id);
  }
}
