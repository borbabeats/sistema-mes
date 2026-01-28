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
import { IniciarManutencaoUseCase } from '../../application/use-cases/maquinas/iniciar-manutencao.use-case';
import { FinalizarManutencaoUseCase } from '../../application/use-cases/maquinas/finalizar-manutencao.use-case';
import { MaquinasService } from './maquinas.service';
import { CreateMaquinaDto } from '../../presentation/dto/maquinas/create-maquina.dto';
import { UpdateMaquinaDto } from '../../presentation/dto/maquinas/update-maquina.dto';
import { IniciarManutencaoDto } from '../../presentation/dto/maquinas/iniciar-manutencao.dto';
import { FinalizarManutencaoDto } from '../../presentation/dto/maquinas/finalizar-manutencao.dto';
import { StatusMaquina, StatusManutencao, Maquina } from '../../domain/entities/maquina.entity';
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
    private readonly iniciarManutencaoUseCase: IniciarManutencaoUseCase,
    private readonly finalizarManutencaoUseCase: FinalizarManutencaoUseCase,
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

  // Rotas para Manutenções

  @Post(':id/manutencoes')
  @Roles(Cargo.ADMIN, Cargo.GERENTE)
  @ApiOperation({ summary: 'Inicia uma manutenção para uma máquina' })
  @ApiResponse({ status: 200, description: 'Manutenção iniciada com sucesso', type: Maquina })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou máquina não pode entrar em manutenção' })
  @ApiResponse({ status: 404, description: 'Máquina não encontrada' })
  iniciarManutencao(
    @Param('id', ParseIntPipe) maquinaId: number,
    @Body() iniciarManutencaoDto: IniciarManutencaoDto,
  ) {
    return this.iniciarManutencaoUseCase.execute(maquinaId, iniciarManutencaoDto);
  }

  @Patch(':id/manutencoes/finalizar')
  @Roles(Cargo.ADMIN, Cargo.GERENTE)
  @ApiOperation({ summary: 'Finaliza a manutenção de uma máquina' })
  @ApiResponse({ status: 200, description: 'Manutenção finalizada com sucesso', type: Maquina })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou máquina não está em manutenção' })
  @ApiResponse({ status: 404, description: 'Máquina não encontrada' })
  finalizarManutencao(
    @Param('id', ParseIntPipe) maquinaId: number,
    @Body() finalizarManutencaoDto: FinalizarManutencaoDto,
  ) {
    return this.finalizarManutencaoUseCase.execute(maquinaId, finalizarManutencaoDto);
  }
}
