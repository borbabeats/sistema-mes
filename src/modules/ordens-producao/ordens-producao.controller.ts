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
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrdensProducaoService } from './ordens-producao.service';
import { CreateOrdemProducaoDto } from '../../presentation/dto/ordens-producao/create-ordem-producao.dto';
import { UpdateOrdemProducaoDto } from '../../presentation/dto/ordens-producao/update-ordem-producao.dto';
import { FindAllOrdensProducaoDto } from '../../presentation/dto/ordens-producao/find-all-ordens-producao.dto';
import { ChangeStatusOrdemProducaoDto } from '../../presentation/dto/ordens-producao/change-status-ordem-producao.dto';
import { OrdemProducao } from '../../domain/entities/ordem-producao.entity';
import { PaginatedResult } from '../../presentation/dto/common/pagination.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { Role } from '../../auth/role.enum';

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
  @ApiOperation({ summary: 'Listar todas as ordens de produção com filtros e paginação' })
  @ApiResponse({ status: 200, description: 'Lista paginada de ordens de produção' })
  findAll(@Query() filters: FindAllOrdensProducaoDto): Promise<PaginatedResult<OrdemProducao>> {
    return this.ordensProducaoService.findAllPaginated(filters);
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

  @Patch(':id/status')
  @Roles(Role.ADMIN, Role.GERENTE, Role.OPERADOR)
  @ApiOperation({ summary: 'Mudar status de uma ordem de produção (state machine)' })
  @ApiResponse({ status: 200, description: 'Status atualizado', type: OrdemProducao })
  @ApiResponse({ status: 400, description: 'Transição inválida ou não permitida' })
  @ApiResponse({ status: 404, description: 'Ordem de produção não encontrada' })
  async changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangeStatusOrdemProducaoDto,
    @Request() req: any,
  ): Promise<OrdemProducao> {
    const userRoles = req.user?.roles || [];
    const userId = req.user?.sub;
    return this.ordensProducaoService.changeStatus(id, dto, userRoles, userId);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.GERENTE)
  @ApiOperation({ summary: 'Remover uma ordem de produção (soft delete)' })
  @ApiResponse({ status: 200, description: 'Ordem de produção removida' })
  @ApiResponse({ status: 404, description: 'Ordem de produção não encontrada' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string; id: number; codigo: string }> {
    return this.ordensProducaoService.remove(id);
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
