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
  ApiParam
} from '@nestjs/swagger';
import { AgendarManutencaoUseCase } from '../../application/use-cases/manutencoes/agendar-manutencao.use-case';
import { ListarManutencoesUseCase } from '../../application/use-cases/manutencoes/listar-manutencoes.use-case';
import { CancelarManutencaoUseCase } from '../../application/use-cases/manutencoes/cancelar-manutencao.use-case';
import { AgendarManutencaoDto } from '../../presentation/dto/maquinas/agendar-manutencao.dto';
import { CancelarManutencaoDto } from '../../presentation/dto/maquinas/cancelar-manutencao.dto';
import { StatusManutencao } from '../../domain/entities/manutencao.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Cargo } from '../../domain/entities/usuario.entity';

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
  async findAgendadas() {
    return this.listarManutencoesUseCase.findAgendadas();
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
  async findAtrasadas() {
    return this.listarManutencoesUseCase.findAtrasadas();
  }

  @Post()
  @Roles(Cargo.ADMIN, Cargo.GERENTE)
  @ApiOperation({ summary: 'Agenda uma nova manutenção' })
  @ApiResponse({ status: 201, description: 'Manutenção agendada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Máquina não encontrada' })
  async agendar(@Body() agendarManutencaoDto: AgendarManutencaoDto) {
    return this.agendarManutencaoUseCase.execute(agendarManutencaoDto);
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
