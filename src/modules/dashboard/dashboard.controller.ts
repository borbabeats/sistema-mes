import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { Role } from '../../auth/role.enum';
import { KpisProducaoDto } from '../../presentation/dto/dashboard/kpis-producao.dto';
import { KpisQualidadeDto } from '../../presentation/dto/dashboard/kpis-qualidade.dto';
import { KpisRecursosDto } from '../../presentation/dto/dashboard/kpis-recursos.dto';
import { KpisPrazosDto } from '../../presentation/dto/dashboard/kpis-prazos.dto';
import { GraficoProducaoDiariaDto } from '../../presentation/dto/dashboard/grafico-producao-diaria.dto';
import { GraficoProducaoSetorDto } from '../../presentation/dto/dashboard/grafico-producao-setor.dto';
import { GraficoStatusOpsDto } from '../../presentation/dto/dashboard/grafico-status-ops.dto';
import { OeeTempoRealDto } from '../../presentation/dto/dashboard/oee-tempo-real.dto';
import { TopProdutosDto } from '../../presentation/dto/dashboard/top-produtos.dto';
import { ProducaoPorTurnoDto } from '../../presentation/dto/dashboard/producao-por-turno.dto';
import { AlertasCriticosDto } from '../../presentation/dto/dashboard/alertas-criticos.dto';
import { MetasDiaDto } from '../../presentation/dto/dashboard/metas-dia.dto';
import { EficienciaOperadoresDto } from '../../presentation/dto/dashboard/eficiencia-operadores.dto';

@ApiTags('dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('kpis/producao')
  @Roles(Role.ADMIN, Role.GERENTE, Role.OPERADOR)
  @ApiOperation({ summary: 'Obter KPIs de Produção' })
  @ApiResponse({
    status: 200,
    description: 'KPIs de produção obtidos com sucesso',
    type: KpisProducaoDto,
  })
  async getKpisProducao(): Promise<KpisProducaoDto> {
    return this.dashboardService.getKpisProducao();
  }

  @Get('kpis/qualidade')
  @Roles(Role.ADMIN, Role.GERENTE, Role.OPERADOR)
  @ApiOperation({ summary: 'Obter KPIs de Qualidade' })
  @ApiResponse({
    status: 200,
    description: 'KPIs de qualidade obtidos com sucesso',
    type: KpisQualidadeDto,
  })
  async getKpisQualidade(): Promise<KpisQualidadeDto> {
    return this.dashboardService.getKpisQualidade();
  }

  @Get('kpis/recursos')
  @Roles(Role.ADMIN, Role.GERENTE, Role.OPERADOR)
  @ApiOperation({ summary: 'Obter KPIs de Recursos' })
  @ApiResponse({
    status: 200,
    description: 'KPIs de recursos obtidos com sucesso',
    type: KpisRecursosDto,
  })
  async getKpisRecursos(): Promise<KpisRecursosDto> {
    return this.dashboardService.getKpisRecursos();
  }

  @Get('kpis/prazos')
  @Roles(Role.ADMIN, Role.GERENTE, Role.OPERADOR)
  @ApiOperation({ summary: 'Obter KPIs de Prazos' })
  @ApiResponse({
    status: 200,
    description: 'KPIs de prazos obtidos com sucesso',
    type: KpisPrazosDto,
  })
  async getKpisPrazos(): Promise<KpisPrazosDto> {
    return this.dashboardService.getKpisPrazos();
  }

  @Get('graficos/producao-diaria')
  @Roles(Role.ADMIN, Role.GERENTE, Role.OPERADOR)
  @ApiOperation({ summary: 'Obter dados para gráfico de produção diária' })
  @ApiQuery({
    name: 'dias',
    required: false,
    type: Number,
    description: 'Número de dias para análise (padrão: 30)',
  })
  @ApiResponse({
    status: 200,
    description: 'Dados do gráfico de produção diária obtidos com sucesso',
    type: [GraficoProducaoDiariaDto],
  })
  async getGraficoProducaoDiaria(
    @Query('dias') dias: number = 30,
  ): Promise<GraficoProducaoDiariaDto[]> {
    return this.dashboardService.getGraficoProducaoDiaria(dias);
  }

  @Get('graficos/producao-por-setor')
  @Roles(Role.ADMIN, Role.GERENTE, Role.OPERADOR)
  @ApiOperation({ summary: 'Obter dados para gráfico de produção por setor' })
  @ApiQuery({
    name: 'periodo',
    required: false,
    type: String,
    description: 'Período de análise (hoje, semana, mes, ano)',
  })
  @ApiResponse({
    status: 200,
    description: 'Dados do gráfico de produção por setor obtidos com sucesso',
    type: [GraficoProducaoSetorDto],
  })
  async getGraficoProducaoPorSetor(
    @Query('periodo') periodo: string = 'mes',
  ): Promise<GraficoProducaoSetorDto[]> {
    return this.dashboardService.getGraficoProducaoPorSetor(periodo);
  }

  @Get('graficos/status-ops')
  @Roles(Role.ADMIN, Role.GERENTE, Role.OPERADOR)
  @ApiOperation({ summary: 'Obter dados para gráfico de status das OPs' })
  @ApiResponse({
    status: 200,
    description: 'Dados do gráfico de status das OPs obtidos com sucesso',
    type: [GraficoStatusOpsDto],
  })
  async getGraficoStatusOps(): Promise<GraficoStatusOpsDto[]> {
    return this.dashboardService.getGraficoStatusOps();
  }

  @Get('graficos/tendencia-qualidade')
  @Roles(Role.ADMIN, Role.GERENTE, Role.OPERADOR)
  @ApiOperation({
    summary: 'Obter dados para gráfico de tendência de qualidade',
  })
  @ApiQuery({
    name: 'dias',
    required: false,
    type: Number,
    description: 'Número de dias para análise (padrão: 30)',
  })
  @ApiResponse({
    status: 200,
    description:
      'Dados do gráfico de tendência de qualidade obtidos com sucesso',
  })
  async getGraficoTendenciaQualidade(@Query('dias') dias: number = 30) {
    return this.dashboardService.getGraficoTendenciaQualidade(dias);
  }

  @Get('graficos/oee-tempo-real')
  @Roles(Role.ADMIN, Role.GERENTE, Role.OPERADOR)
  @ApiOperation({ summary: 'Obter OEE em tempo real' })
  @ApiResponse({
    status: 200,
    description: 'OEE em tempo real obtido com sucesso',
    type: OeeTempoRealDto,
  })
  async getOeeTempoReal(): Promise<OeeTempoRealDto> {
    return this.dashboardService.getOeeTempoReal();
  }

  @Get('graficos/top-produtos')
  @Roles(Role.ADMIN, Role.GERENTE, Role.OPERADOR)
  @ApiOperation({ summary: 'Obter Top 5 produtos mais produzidos' })
  @ApiQuery({
    name: 'periodo',
    required: false,
    type: String,
    description: 'Período de análise (hoje, semana, mes, ano)',
  })
  @ApiResponse({
    status: 200,
    description: 'Top 5 produtos obtidos com sucesso',
    type: [TopProdutosDto],
  })
  async getTopProdutos(
    @Query('periodo') periodo: string = 'mes',
  ): Promise<TopProdutosDto[]> {
    return this.dashboardService.getTopProdutos(periodo);
  }

  @Get('graficos/producao-por-turno')
  @Roles(Role.ADMIN, Role.GERENTE, Role.OPERADOR)
  @ApiOperation({ summary: 'Obter heatmap de produção por turno' })
  @ApiQuery({
    name: 'dias',
    required: false,
    type: Number,
    description: 'Número de dias para análise (padrão: 7)',
  })
  @ApiResponse({
    status: 200,
    description: 'Heatmap de produção por turno obtido com sucesso',
    type: [ProducaoPorTurnoDto],
  })
  async getProducaoPorTurno(
    @Query('dias') dias: number = 7,
  ): Promise<ProducaoPorTurnoDto[]> {
    return this.dashboardService.getProducaoPorTurno(dias);
  }

  @Get('alertas/criticos')
  @Roles(Role.ADMIN, Role.GERENTE, Role.OPERADOR)
  @ApiOperation({ summary: 'Obter alertas críticos em tempo real' })
  @ApiResponse({
    status: 200,
    description: 'Alertas críticos obtidos com sucesso',
    type: AlertasCriticosDto,
  })
  async getAlertasCriticos(): Promise<AlertasCriticosDto> {
    return this.dashboardService.getAlertasCriticos();
  }

  @Get('metas/dia')
  @Roles(Role.ADMIN, Role.GERENTE, Role.OPERADOR)
  @ApiOperation({ summary: 'Obter progresso das metas do dia' })
  @ApiResponse({
    status: 200,
    description: 'Metas do dia obtidas com sucesso',
    type: MetasDiaDto,
  })
  async getMetasDia(): Promise<MetasDiaDto> {
    return this.dashboardService.getMetasDia();
  }

  @Get('eficiencia/operadores')
  @Roles(Role.ADMIN, Role.GERENTE, Role.OPERADOR)
  @ApiOperation({ summary: 'Obter ranking de eficiência por operador' })
  @ApiQuery({
    name: 'periodo',
    required: false,
    type: String,
    description: 'Período de análise (hoje, semana, mes)',
  })
  @ApiResponse({
    status: 200,
    description: 'Ranking de eficiência obtido com sucesso',
    type: [EficienciaOperadoresDto],
  })
  async getEficienciaOperadores(
    @Query('periodo') periodo: string = 'semana',
  ): Promise<EficienciaOperadoresDto[]> {
    return this.dashboardService.getEficienciaOperadores(periodo);
  }
}
