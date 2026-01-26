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
  ApiBody
} from '@nestjs/swagger';
import { CreateMaquinaUseCase } from '../../application/use-cases/maquinas/create-maquina.use-case';
import { MaquinasService } from './maquinas.service';
import { CreateMaquinaDto } from '../../presentation/dto/maquinas/create-maquina.dto';
import { UpdateMaquinaDto } from '../../presentation/dto/maquinas/update-maquina.dto';
import { StatusMaquina } from '../../domain/entities/maquina.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Cargo } from '../../domain/entities/usuario.entity';

@ApiBearerAuth()
@ApiTags('máquinas')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('maquinas')
export class MaquinasController {
  constructor(
    private readonly createMaquinaUseCase: CreateMaquinaUseCase,
    private readonly maquinasService: MaquinasService,
  ) {}

  // Rotas para Máquinas

  @Post()
  @Roles(Cargo.ADMIN, Cargo.GERENTE)
  @ApiOperation({ summary: 'Cria uma nova máquina' })
  @ApiResponse({ status: 201, description: 'Máquina criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Código de máquina já existe' })
  create(@Body() createMaquinaDto: CreateMaquinaDto) {
    return this.createMaquinaUseCase.execute(createMaquinaDto);
  }

  @Get()
  @Roles(Cargo.ADMIN, Cargo.GERENTE, Cargo.OPERADOR)
  @ApiOperation({ summary: 'Lista todas as máquinas' })
  @ApiResponse({ status: 200, description: 'Lista de máquinas retornada com sucesso' })
  @ApiQuery({ name: 'status', enum: StatusMaquina, required: false })
  @ApiQuery({ name: 'setorId', required: false, type: Number })
  async findAll(
    @Query('status') status?: StatusMaquina,
    @Query('setorId') setorId?: string,
  ) {
    // Filtra por status e/ou setor, se fornecidos
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (setorId) {
      where.setorId = parseInt(setorId, 10);
    }

    return this.maquinasService.findAll(where);
  }

  @Get(':id')
  @Roles(Cargo.ADMIN, Cargo.GERENTE, Cargo.OPERADOR)
  @ApiOperation({ summary: 'Obtém uma máquina pelo ID' })
  @ApiResponse({ status: 200, description: 'Máquina encontrada' })
  @ApiResponse({ status: 404, description: 'Máquina não encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.maquinasService.findOne(id);
  }

  @Patch(':id')
  @Roles(Cargo.ADMIN, Cargo.GERENTE)
  @ApiOperation({ summary: 'Atualiza uma máquina' })
  @ApiResponse({ status: 200, description: 'Máquina atualizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Máquina não encontrada' })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateMaquinaDto: UpdateMaquinaDto
  ) {
    return this.maquinasService.update(id, updateMaquinaDto);
  }

  @Delete(':id')
  @Roles(Cargo.ADMIN, Cargo.GERENTE)
  @ApiOperation({ summary: 'Remove uma máquina' })
  @ApiResponse({ status: 200, description: 'Máquina removida com sucesso' })
  @ApiResponse({ status: 400, description: 'Não é possível remover uma máquina em uso' })
  @ApiResponse({ status: 404, description: 'Máquina não encontrada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.maquinasService.remove(id);
  }

  // Rotas para Manutenções - TODO: Implementar quando os DTOs de manutenção estiverem disponíveis na clean architecture

  /*
  @Post(':id/manutencoes')
  @Roles(Cargo.ADMIN, Cargo.GERENTE)
  @ApiOperation({ summary: 'Cria uma nova manutenção para uma máquina' })
  @ApiResponse({ status: 201, description: 'Manutenção criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Máquina ou responsável não encontrado' })
  createManutencao(
    @Param('id', ParseIntPipe) maquinaId: number,
    @Body() createManutencaoDto: CreateManutencaoDto,
  ) {
    return this.maquinasService.createManutencao({
      ...createManutencaoDto,
      maquinaId,
    });
  }

  @Get(':id/manutencoes')
  @Roles(Cargo.ADMIN, Cargo.GERENTE, Cargo.OPERADOR)
  @ApiOperation({ summary: 'Lista as manutenções de uma máquina' })
  @ApiResponse({ status: 200, description: 'Lista de manutenções retornada com sucesso' })
  @ApiQuery({ name: 'status', enum: StatusManutencao, required: false })
  @ApiQuery({ name: 'tipo', required: false })
  findManutencoes(
    @Param('id', ParseIntPipe) maquinaId: number,
    @Query('status') status?: StatusManutencao,
    @Query('tipo') tipo?: string,
  ) {
    return this.maquinasService.findAllManutencoes(maquinaId, status);
  }

  @Get('manutencoes/:manutencaoId')
  @Roles(Cargo.ADMIN, Cargo.GERENTE, Cargo.OPERADOR)
  @ApiOperation({ summary: 'Obtém uma manutenção pelo ID' })
  @ApiResponse({ status: 200, description: 'Manutenção encontrada' })
  @ApiResponse({ status: 404, description: 'Manutenção não encontrada' })
  findManutencaoById(@Param('manutencaoId', ParseIntPipe) id: number) {
    return this.maquinasService.findManutencaoById(id);
  }

  @Patch('manutencoes/:manutencaoId')
  @Roles(Cargo.ADMIN, Cargo.GERENTE)
  @ApiOperation({ summary: 'Atualiza uma manutenção' })
  @ApiResponse({ status: 200, description: 'Manutenção atualizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Manutenção não encontrada' })
  updateManutencao(
    @Param('manutencaoId', ParseIntPipe) id: number,
    @Body() updateManutencaoDto: UpdateManutencaoDto,
  ) {
    return this.maquinasService.updateManutencao(id, updateManutencaoDto);
  }

  @Delete('manutencoes/:manutencaoId')
  @Roles(Cargo.ADMIN, Cargo.GERENTE)
  @ApiOperation({ summary: 'Remove uma manutenção' })
  @ApiResponse({ status: 200, description: 'Manutenção removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Manutenção não encontrada' })
  removeManutencao(@Param('manutencaoId', ParseIntPipe) id: number) {
    return this.maquinasService.removeManutencao(id);
  }

  // Rotas para Histórico de Manutenção

  @Get('manutencoes/:manutencaoId/historico')
  @Roles(Cargo.ADMIN, Cargo.GERENTE, Cargo.OPERADOR)
  @ApiOperation({ summary: 'Obtém o histórico de uma manutenção' })
  @ApiResponse({ status: 200, description: 'Histórico retornado com sucesso' })
  @ApiResponse({ status: 404, description: 'Manutenção não encontrada' })
  findHistoricoManutencao(
    @Param('manutencaoId', ParseIntPipe) manutencaoId: number,
  ) {
    return this.maquinasService.findHistoricoManutencao(manutencaoId);
  }

  // Rotas para Controle de Tempo de Operação

  @Get(':id/tempo-uso')
  @Roles(Cargo.ADMIN, Cargo.GERENTE, Cargo.OPERADOR)
  @ApiOperation({ summary: 'Obtém o tempo de uso de uma máquina em um período' })
  @ApiResponse({ status: 200, description: 'Tempo de uso calculado com sucesso' })
  @ApiResponse({ status: 400, description: 'Período inválido' })
  @ApiResponse({ status: 404, description: 'Máquina não encontrada' })
  @ApiQuery({ name: 'inicio', required: true, description: 'Data de início (ISO 8601)' })
  @ApiQuery({ name: 'fim', required: true, description: 'Data de fim (ISO 8601)' })
  async getTempoUsoMaquina(
    @Param('id', ParseIntPipe) maquinaId: number,
    @Query('inicio') inicioStr: string,
    @Query('fim') fimStr: string,
  ) {
    const inicio = new Date(inicioStr);
    const fim = new Date(fimStr);

    if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
      throw new BadRequestException('Datas de início e fim devem ser válidas');
    }

    if (inicio >= fim) {
      throw new BadRequestException('A data de início deve ser anterior à data de fim');
    }

    return this.maquinasService.getTempoUsoMaquina(maquinaId, inicio, fim);
  }
  */
}
