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
  BadRequestException,
  UseGuards,
  Req
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ListarManutencoesUseCase } from '../../application/use-cases/manutencoes/listar-manutencoes.use-case';
import { AgendarManutencaoUseCase } from '../../application/use-cases/manutencoes/agendar-manutencao.use-case';
import { CancelarManutencaoUseCase } from '../../application/use-cases/manutencoes/cancelar-manutencao.use-case';
import { AgendarManutencaoDto } from '../../presentation/dto/maquinas/agendar-manutencao.dto';
import { CancelarManutencaoDto } from '../../presentation/dto/maquinas/cancelar-manutencao.dto';
import { PaginationDto } from '../../presentation/dto/pagination.dto';
import { Cargo } from '../../domain/entities/usuario.entity';
import { StatusManutencao } from '../../domain/entities/manutencao.entity';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiBearerAuth()
@ApiTags('manutenções')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('manutencoes')
export class ManutencoesController {
  constructor(
    private readonly agendarManutencaoUseCase: AgendarManutencaoUseCase,
    private readonly listarManutencoesUseCase: ListarManutencoesUseCase,
    private readonly cancelarManutencaoUseCase: CancelarManutencaoUseCase,
  ) {}

  @Get()
  @Roles(Cargo.ADMIN, Cargo.GERENTE, Cargo.OPERADOR)
  @ApiOperation({ summary: 'Lista todas as manutenções' })
  @ApiResponse({ status: 200, description: 'Lista de manutenções retornada com sucesso' })
  @ApiQuery({ name: 'maquinaId', required: false, type: Number })
  @ApiQuery({ name: 'status', enum: StatusManutencao, required: false })
  @ApiQuery({ name: 'responsavelId', required: false, type: Number })
  @ApiQuery({ name: 'dataInicio', required: false, type: Date })
  @ApiQuery({ name: 'dataFim', required: false, type: Date })
  async findAll(
    @Query('maquinaId') maquinaId?: string,
    @Query('status') status?: StatusManutencao,
    @Query('responsavelId') responsavelId?: string,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
  ) {
    const filters: any = {};
    
    if (maquinaId) filters.maquinaId = parseInt(maquinaId, 10);
    if (status) filters.status = status;
    if (responsavelId) filters.responsavelId = parseInt(responsavelId, 10);
    if (dataInicio) filters.dataInicio = new Date(dataInicio);
    if (dataFim) filters.dataFim = new Date(dataFim);

    return this.listarManutencoesUseCase.execute(filters);
  }

  @Get('agendadas')
  @Roles(Cargo.ADMIN, Cargo.GERENTE, Cargo.OPERADOR)
  @ApiOperation({ summary: 'Lista manutenções agendadas' })
  @ApiResponse({ status: 200, description: 'Lista de manutenções agendadas retornada com sucesso' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async findAgendadas(@Query() pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const result = await this.listarManutencoesUseCase.findAgendadasPaginated(page, limit);
    
    return {
      data: result.data,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
        hasNext: page * limit < result.total,
        hasPrev: page > 1,
      },
    };
  }

  @Get('em-andamento')
  @Roles(Cargo.ADMIN, Cargo.GERENTE, Cargo.OPERADOR)
  @ApiOperation({ summary: 'Lista manutenções em andamento' })
  @ApiResponse({ status: 200, description: 'Lista de manutenções em andamento retornada com sucesso' })
  async findEmAndamento() {
    return this.listarManutencoesUseCase.findEmAndamento();
  }

  @Get('atrasadas')
  @Roles(Cargo.ADMIN, Cargo.GERENTE, Cargo.OPERADOR)
  @ApiOperation({ summary: 'Lista manutenções atrasadas' })
  @ApiResponse({ status: 200, description: 'Lista de manutenções atrasadas retornada com sucesso' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async findAtrasadas(@Query() pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const result = await this.listarManutencoesUseCase.findAtrasadasPaginated(page, limit);
    
    return {
      data: result.data,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
        hasNext: page * limit < result.total,
        hasPrev: page > 1,
      },
    };
  }

  @Post()
  @Roles(Cargo.ADMIN, Cargo.GERENTE)
  @ApiOperation({ summary: 'Agenda uma nova manutenção' })
  @ApiResponse({ status: 201, description: 'Manutenção agendada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Máquina não encontrada' })
  async agendar(@Body() agendarManutencaoDto: AgendarManutencaoDto) {
    const result = await this.agendarManutencaoUseCase.execute(agendarManutencaoDto);
    return {
      message: 'Manutenção agendada com sucesso',
      data: result.manutencao
    };
  }

  @Patch(':id/cancelar')
  @Roles(Cargo.ADMIN, Cargo.GERENTE)
  @ApiOperation({ summary: 'Cancela uma manutenção' })
  @ApiResponse({ status: 200, description: 'Manutenção cancelada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou manutenção não pode ser cancelada' })
  @ApiResponse({ status: 404, description: 'Manutenção não encontrada' })
  async cancelar(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CancelarManutencaoDto
  ) {
    return this.cancelarManutencaoUseCase.execute(id, data);
  }
}
