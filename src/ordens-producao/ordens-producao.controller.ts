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
import { OrdensProducaoService } from './ordens-producao.service';
import { CreateOrdemProducaoDto } from '../presentation/dto/ordens-producao/create-ordem-producao.dto';
import { UpdateOrdemProducaoDto } from '../presentation/dto/ordens-producao/update-ordem-producao.dto';
import { FilterOrdemProducaoDto } from '../presentation/dto/ordens-producao/filter-ordem-producao.dto';
import { OrdemProducao } from '../domain/entities/ordem-producao.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@ApiTags('ordens-producao')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ordens-producao')
export class OrdensProducaoController {
  constructor(private readonly ordensProducaoService: OrdensProducaoService) {}

  @Post()
  @Roles(Role.ADMIN, Role.GERENTE)
  @ApiOperation({ summary: 'Criar uma nova ordem de produção' })
  @ApiResponse({ status: 201, description: 'Ordem de produção criada com sucesso', type: OrdemProducao })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() createOrdemProducaoDto: CreateOrdemProducaoDto): Promise<OrdemProducao> {
    return this.ordensProducaoService.create(createOrdemProducaoDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.GERENTE, Role.OPERADOR)
  @ApiOperation({ summary: 'Listar todas as ordens de produção' })
  @ApiResponse({ status: 200, description: 'Lista de ordens de produção', type: [OrdemProducao] })
  findAll(@Query() filters?: FilterOrdemProducaoDto): Promise<OrdemProducao[]> {
    return this.ordensProducaoService.findAll(filters);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.GERENTE, Role.OPERADOR)
  @ApiOperation({ summary: 'Obter uma ordem de produção pelo ID' })
  @ApiResponse({ status: 200, description: 'Ordem de produção encontrada', type: OrdemProducao })
  @ApiResponse({ status: 404, description: 'Ordem de produção não encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<OrdemProducao> {
    return this.ordensProducaoService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.GERENTE)
  @ApiOperation({ summary: 'Atualizar uma ordem de produção' })
  @ApiResponse({ status: 200, description: 'Ordem de produção atualizada', type: OrdemProducao })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Ordem de produção não encontrada' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrdemProducaoDto: UpdateOrdemProducaoDto,
  ): Promise<OrdemProducao> {
    return this.ordensProducaoService.update(id, updateOrdemProducaoDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.GERENTE)
  @ApiOperation({ summary: 'Remover uma ordem de produção (soft delete)' })
  @ApiResponse({ status: 200, description: 'Ordem de produção removida' })
  @ApiResponse({ status: 404, description: 'Ordem de produção não encontrada' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string; id: number; codigo: string }> {
    return this.ordensProducaoService.remove(id);
  }

  @Post(':id/iniciar')
  @Roles(Role.ADMIN, Role.GERENTE, Role.OPERADOR)
  @ApiOperation({ summary: 'Iniciar a produção de uma ordem' })
  @ApiResponse({ status: 200, description: 'Produção iniciada', type: OrdemProducao })
  @ApiResponse({ status: 400, description: 'Não é possível iniciar a produção' })
  @ApiResponse({ status: 404, description: 'Ordem de produção não encontrada' })
  iniciarProducao(@Param('id', ParseIntPipe) id: number): Promise<OrdemProducao> {
    return this.ordensProducaoService.iniciarProducao(id);
  }

  @Post(':id/pausar')
  @Roles(Role.ADMIN, Role.GERENTE, Role.OPERADOR)
  @ApiOperation({ summary: 'Pausar a produção de uma ordem' })
  @ApiResponse({ status: 200, description: 'Produção pausada', type: OrdemProducao })
  @ApiResponse({ status: 400, description: 'Não é possível pausar a produção' })
  @ApiResponse({ status: 404, description: 'Ordem de produção não encontrada' })
  pausarProducao(@Param('id', ParseIntPipe) id: number): Promise<OrdemProducao> {
    return this.ordensProducaoService.pausarProducao(id);
  }

  @Post(':id/retomar')
  @Roles(Role.ADMIN, Role.GERENTE, Role.OPERADOR)
  @ApiOperation({ summary: 'Retomar a produção de uma ordem pausada' })
  @ApiResponse({ status: 200, description: 'Produção retomada', type: OrdemProducao })
  @ApiResponse({ status: 400, description: 'Não é possível retomar a produção' })
  @ApiResponse({ status: 404, description: 'Ordem de produção não encontrada' })
  retomarProducao(@Param('id', ParseIntPipe) id: number): Promise<OrdemProducao> {
    return this.ordensProducaoService.retomarProducao(id);
  }

  @Post(':id/finalizar')
  @Roles(Role.ADMIN, Role.GERENTE, Role.OPERADOR)
  @ApiOperation({ summary: 'Finalizar a produção de uma ordem' })
  @ApiResponse({ status: 200, description: 'Produção finalizada', type: OrdemProducao })
  @ApiResponse({ status: 400, description: 'Não é possível finalizar a produção' })
  @ApiResponse({ status: 404, description: 'Ordem de produção não encontrada' })
  finalizarProducao(@Param('id', ParseIntPipe) id: number): Promise<OrdemProducao> {
    return this.ordensProducaoService.finalizarProducao(id);
  }

  @Post(':id/cancelar')
  @Roles(Role.ADMIN, Role.GERENTE)
  @ApiOperation({ summary: 'Cancelar uma ordem de produção' })
  @ApiResponse({ status: 200, description: 'Ordem de produção cancelada', type: OrdemProducao })
  @ApiResponse({ status: 400, description: 'Não é possível cancelar a ordem de produção' })
  @ApiResponse({ status: 404, description: 'Ordem de produção não encontrada' })
  cancelarProducao(
    @Param('id', ParseIntPipe) id: number,
    @Body('motivo') motivo: string,
  ): Promise<OrdemProducao> {
    return this.ordensProducaoService.cancelarProducao(id, motivo);
  }

  @Post(':id/atualizar-producao')
  @Roles(Role.ADMIN, Role.GERENTE, Role.OPERADOR)
  @ApiOperation({ summary: 'Atualizar a quantidade produzida de uma ordem' })
  @ApiResponse({ status: 200, description: 'Produção atualizada', type: OrdemProducao })
  @ApiResponse({ status: 400, description: 'Não é possível atualizar a produção' })
  @ApiResponse({ status: 404, description: 'Ordem de produção não encontrada' })
  atualizarProducao(
    @Param('id', ParseIntPipe) id: number,
    @Body('quantidade', ParseIntPipe) quantidade: number,
    @Body('defeitos') defeitos: number = 0,
  ): Promise<OrdemProducao> {
    return this.ordensProducaoService.atualizarProducao(id, quantidade, defeitos);
  }
}