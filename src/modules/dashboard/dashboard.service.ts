import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StatusOP, StatusMaquina } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getKpisProducao() {
    const agora = new Date();
    const ultimas24h = new Date(agora.getTime() - 24 * 60 * 60 * 1000);

    // OPs Ativas
    const opsAtivas = await this.prisma.ordemProducao.count({
      where: {
        status: {
          in: [StatusOP.EM_ANDAMENTO, StatusOP.PLANEJADA],
        },
        deletedAt: null,
      },
    });

    // Produção do Dia
    const producaoDia = await this.prisma.apontamento.aggregate({
      where: {
        dataInicio: {
          gte: ultimas24h,
        },
      },
      _sum: {
        quantidadeProduzida: true,
      },
    });

    // Produção Planejada do Dia
    const producaoPlanejadaDia = await this.prisma.ordemProducao.aggregate({
      where: {
        dataInicioPlanejado: {
          gte: ultimas24h,
          lte: agora,
        },
        deletedAt: null,
      },
      _sum: {
        quantidadePlanejada: true,
      },
    });

    // Total Produzido e com Defeito para Taxa de Defeitos
    const totalProduzido = await this.prisma.apontamento.aggregate({
      _sum: {
        quantidadeProduzida: true,
        quantidadeDefeito: true,
      },
    });

    const producaoReal = producaoDia._sum.quantidadeProduzida || 0;
    const producaoPlanejada =
      producaoPlanejadaDia._sum.quantidadePlanejada || 0;
    const totalProduzidoGeral = totalProduzido._sum.quantidadeProduzida || 0;
    const totalDefeitos = totalProduzido._sum.quantidadeDefeito || 0;

    // Eficiência Global
    const eficienciaGlobal =
      producaoPlanejada > 0 ? (producaoReal / producaoPlanejada) * 100 : 0;

    // Taxa de Defeitos
    const taxaDefeitos =
      totalProduzidoGeral > 0 ? (totalDefeitos / totalProduzidoGeral) * 100 : 0;

    return {
      opsAtivas,
      producaoDia: producaoReal,
      eficienciaGlobal: Number(eficienciaGlobal.toFixed(2)),
      taxaDefeitos: Number(taxaDefeitos.toFixed(2)),
    };
  }

  async getKpisQualidade() {
    // Índice de Qualidade
    const totalProduzido = await this.prisma.apontamento.aggregate({
      _sum: {
        quantidadeProduzida: true,
        quantidadeDefeito: true,
      },
    });

    const total = totalProduzido._sum.quantidadeProduzida || 0;
    const defeitos = totalProduzido._sum.quantidadeDefeito || 0;
    const indiceQualidade = total > 0 ? ((total - defeitos) / total) * 100 : 0;

    // Rejeições do Mês
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    const rejeicoesMes = await this.prisma.apontamento.aggregate({
      where: {
        dataInicio: {
          gte: inicioMes,
        },
      },
      _sum: {
        quantidadeDefeito: true,
      },
    });

    // Conformidade (OPs concluídas dentro dos padrões)
    const opsConcluidas = await this.prisma.ordemProducao.count({
      where: {
        status: StatusOP.FINALIZADA,
        deletedAt: null,
      },
    });

    const opsConforme = await this.prisma.ordemProducao.count({
      where: {
        status: StatusOP.FINALIZADA,
        quantidadeProduzida: {
          gte: this.prisma.ordemProducao.fields.quantidadePlanejada,
        },
        deletedAt: null,
      },
    });

    const conformidade =
      opsConcluidas > 0 ? (opsConforme / opsConcluidas) * 100 : 0;

    return {
      indiceQualidade: Number(indiceQualidade.toFixed(2)),
      rejeicoesMes: rejeicoesMes._sum.quantidadeDefeito || 0,
      conformidade: Number(conformidade.toFixed(2)),
    };
  }

  async getKpisRecursos() {
    // Máquinas Ativas
    const maquinasAtivas = await this.prisma.maquina.count({
      where: {
        status: {
          in: [StatusMaquina.DISPONIVEL, StatusMaquina.EM_USO],
        },
        deleted_at: null,
      },
    });

    // OEE Simplificado (Overall Equipment Effectiveness)
    const maquinas = await this.prisma.maquina.findMany({
      where: {
        deleted_at: null,
      },
      include: {
        apontamentos: {
          where: {
            dataInicio: {
              gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
            },
          },
        },
      },
    });

    let tempoDisponivelTotal = 0;
    let tempoProducaoTotal = 0;
    let producaoTotal = 0;
    let producaoIdealTotal = 0;

    maquinas.forEach((maquina) => {
      const tempoDisponivel = 24 * 60; // 24 horas em minutos
      tempoDisponivelTotal += tempoDisponivel;

      maquina.apontamentos.forEach((apontamento) => {
        const tempoProducao = apontamento.dataFim
          ? (apontamento.dataFim.getTime() - apontamento.dataInicio.getTime()) /
            (1000 * 60)
          : (new Date().getTime() - apontamento.dataInicio.getTime()) /
            (1000 * 60);

        tempoProducaoTotal += tempoProducao;
        producaoTotal += apontamento.quantidadeProduzida;
        producaoIdealTotal += tempoProducao * 10; // Assumindo 10 unidades/minuto como taxa ideal
      });
    });

    const disponibilidade =
      tempoDisponivelTotal > 0
        ? (tempoProducaoTotal / tempoDisponivelTotal) * 100
        : 0;
    const performance =
      producaoIdealTotal > 0 ? (producaoTotal / producaoIdealTotal) * 100 : 0;
    const qualidade =
      producaoTotal > 0 ? ((producaoTotal - 50) / producaoTotal) * 100 : 0; // Simplificado

    const oee = (disponibilidade * performance * qualidade) / 10000;

    return {
      maquinasAtivas,
      taxaOEE: Number(oee.toFixed(2)),
      disponibilidade: Number(disponibilidade.toFixed(2)),
    };
  }

  async getKpisPrazos() {
    const agora = new Date();

    // OPs em Atraso
    const opsAtraso = await this.prisma.ordemProducao.count({
      where: {
        OR: [
          {
            dataFimPlanejado: {
              lt: agora,
            },
            status: {
              notIn: [StatusOP.FINALIZADA, StatusOP.CANCELADA],
            },
          },
          {
            status: StatusOP.ATRASADA,
          },
        ],
        deletedAt: null,
      },
    });

    // Total de OPs concluídas para cálculo de cumprimento
    const opsConcluidas = await this.prisma.ordemProducao.count({
      where: {
        status: StatusOP.FINALIZADA,
        deletedAt: null,
      },
    });

    // OPs concluídas no prazo
    const opsNoPrazo = await this.prisma.ordemProducao.count({
      where: {
        status: StatusOP.FINALIZADA,
        dataFimReal: {
          not: null,
        },
        dataFimPlanejado: {
          not: null,
        },
        deletedAt: null,
        OR: [
          {
            dataFimReal: {
              lte: this.prisma.ordemProducao.fields.dataFimPlanejado,
            },
          },
        ],
      },
    });

    const cumprimentoPrazos =
      opsConcluidas > 0 ? (opsNoPrazo / opsConcluidas) * 100 : 0;

    // Tempo Médio de Ciclo
    const opsComCiclo = await this.prisma.ordemProducao.findMany({
      where: {
        dataInicioReal: {
          not: null,
        },
        dataFimReal: {
          not: null,
        },
        deletedAt: null,
      },
      select: {
        dataInicioReal: true,
        dataFimReal: true,
      },
    });

    const tempoMedioCiclo =
      opsComCiclo.length > 0
        ? opsComCiclo.reduce((acc, op) => {
            const ciclo =
              op.dataFimReal!.getTime() - op.dataInicioReal!.getTime();
            return acc + ciclo;
          }, 0) /
          opsComCiclo.length /
          (1000 * 60 * 60) // Converter para horas
        : 0;

    return {
      opsAtraso,
      cumprimentoPrazos: Number(cumprimentoPrazos.toFixed(2)),
      tempoMedioCiclo: Number(tempoMedioCiclo.toFixed(2)),
    };
  }

  async getGraficoProducaoDiaria(dias: number = 30) {
    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() - dias);
    dataInicio.setHours(0, 0, 0, 0);

    const producaoDiaria = await this.prisma.$queryRaw`
      SELECT 
        DATE(dataInicio) as data,
        SUM(quantidadeProduzida) as produzido,
        0 as planejado
      FROM apontamentos 
      WHERE dataInicio >= ${dataInicio}
      GROUP BY DATE(dataInicio)
      ORDER BY data ASC
    `;

    // Obter produção planejada
    const producaoPlanejadaDiaria = await this.prisma.$queryRaw`
      SELECT 
        DATE(dataInicioPlanejado) as data,
        SUM(quantidadePlanejada) as planejado
      FROM ordens_producao 
      WHERE dataInicioPlanejado >= ${dataInicio}
        AND deleted_at IS NULL
      GROUP BY DATE(dataInicioPlanejado)
      ORDER BY data ASC
    `;

    // Combinar dados
    const dadosCombinados: {
      data: string;
      produzido: number;
      planejado: number;
    }[] = [];
    const mapaProduzido = new Map(
      (producaoDiaria as any[]).map((item) => [
        (item.data as Date).toISOString().split('T')[0],
        Number(item.produzido),
      ]),
    );
    const mapaPlanejado = new Map(
      (producaoPlanejadaDiaria as any[]).map((item) => [
        (item.data as Date).toISOString().split('T')[0],
        Number(item.planejado),
      ]),
    );

    for (let i = 0; i < dias; i++) {
      const data = new Date(dataInicio);
      data.setDate(data.getDate() + i);
      const dataStr = data.toISOString().split('T')[0];

      dadosCombinados.push({
        data: dataStr,
        produzido: (mapaProduzido.get(dataStr) as number) || 0,
        planejado: (mapaPlanejado.get(dataStr) as number) || 0,
      });
    }

    return dadosCombinados;
  }

  async getGraficoProducaoPorSetor(periodo: string = 'mes') {
    let dataInicio: Date;

    switch (periodo) {
      case 'hoje':
        dataInicio = new Date();
        dataInicio.setHours(0, 0, 0, 0);
        break;
      case 'semana':
        dataInicio = new Date();
        dataInicio.setDate(dataInicio.getDate() - 7);
        break;
      case 'ano':
        dataInicio = new Date();
        dataInicio.setFullYear(dataInicio.getFullYear() - 1);
        break;
      default: // mes
        dataInicio = new Date();
        dataInicio.setDate(dataInicio.getDate() - 30);
    }

    const producaoPorSetor = await this.prisma.$queryRaw`
      SELECT 
        s.nome as setor,
        COALESCE(SUM(a.quantidadeProduzida), 0) as produzido
      FROM setores s
      LEFT JOIN ordens_producao op ON s.id = op.setorId AND op.deleted_at IS NULL
      LEFT JOIN apontamentos a ON op.id = a.opId AND a.dataInicio >= ${dataInicio}
      WHERE s.deleted_at IS NULL
      GROUP BY s.id, s.nome
      ORDER BY produzido DESC
    `;

    return (producaoPorSetor as any[]).map((item) => ({
      setor: item.setor,
      produzido: Number(item.produzido),
    }));
  }

  async getGraficoStatusOps() {
    const statusOps = await this.prisma.ordemProducao.groupBy({
      by: ['status'],
      where: {
        deletedAt: null,
      },
      _count: {
        id: true,
      },
    });

    return statusOps.map((item) => ({
      status: item.status,
      quantidade: item._count.id,
    }));
  }

  async getGraficoTendenciaQualidade(dias: number = 30) {
    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() - dias);
    dataInicio.setHours(0, 0, 0, 0);

    const tendenciaQualidade = await this.prisma.$queryRaw`
      SELECT 
        DATE(dataInicio) as data,
        SUM(quantidadeProduzida) as produzido,
        SUM(quantidadeDefeito) as defeitos,
        CASE 
          WHEN SUM(quantidadeProduzida) > 0 
          THEN (SUM(quantidadeProduzida) - SUM(quantidadeDefeito)) * 100.0 / SUM(quantidadeProduzida)
          ELSE 0 
        END as taxaQualidade
      FROM apontamentos 
      WHERE dataInicio >= ${dataInicio}
      GROUP BY DATE(dataInicio)
      ORDER BY data ASC
    `;

    return (tendenciaQualidade as any[]).map((item) => ({
      data: (item.data as Date).toISOString().split('T')[0],
      taxaQualidade: Number((item.taxaQualidade as number).toFixed(2)),
    }));
  }

  async getOeeTempoReal() {
    // Implementação simplificada do OEE em tempo real
    const agora = new Date();
    const ultimas24h = new Date(agora.getTime() - 24 * 60 * 60 * 1000);

    const maquinas = await this.prisma.maquina.findMany({
      where: {
        deleted_at: null,
      },
      include: {
        apontamentos: {
          where: {
            dataInicio: {
              gte: ultimas24h,
            },
          },
        },
      },
    });

    let oeeTotal = 0;
    let maquinasContadas = 0;

    maquinas.forEach((maquina) => {
      if (maquina.apontamentos.length > 0) {
        const tempoTotal = 24 * 60; // minutos
        const tempoProducao = maquina.apontamentos.reduce((acc, ap) => {
          const fim = ap.dataFim || agora;
          return acc + (fim.getTime() - ap.dataInicio.getTime()) / (1000 * 60);
        }, 0);

        const disponibilidade = (tempoProducao / tempoTotal) * 100;
        const performance = 85; // Simplificado
        const qualidade = 95; // Simplificado

        const oeeMaquina = (disponibilidade * performance * qualidade) / 10000;
        oeeTotal += oeeMaquina;
        maquinasContadas++;
      }
    });

    const oeeMedio = maquinasContadas > 0 ? oeeTotal / maquinasContadas : 0;

    return {
      valor: Number(oeeMedio.toFixed(2)),
      status: oeeMedio < 65 ? 'CRITICO' : oeeMedio < 85 ? 'REGULAR' : 'OTIMO',
      meta: 85,
    };
  }

  async getTopProdutos(periodo: string = 'mes') {
    let dataInicio: Date;

    switch (periodo) {
      case 'hoje':
        dataInicio = new Date();
        dataInicio.setHours(0, 0, 0, 0);
        break;
      case 'semana':
        dataInicio = new Date();
        dataInicio.setDate(dataInicio.getDate() - 7);
        break;
      case 'ano':
        dataInicio = new Date();
        dataInicio.setFullYear(dataInicio.getFullYear() - 1);
        break;
      default: // mes
        dataInicio = new Date();
        dataInicio.setDate(dataInicio.getDate() - 30);
    }

    const topProdutos = await this.prisma.$queryRaw`
      SELECT 
        op.produto,
        SUM(a.quantidadeProduzida) as quantidade,
        CASE 
          WHEN SUM(a.quantidadeProduzida) > 0 
          THEN (SUM(a.quantidadeProduzida) - SUM(a.quantidadeDefeito)) * 100.0 / SUM(a.quantidadeProduzida)
          ELSE 100 
        END as qualidade
      FROM ordens_producao op
      LEFT JOIN apontamentos a ON op.id = a.opId AND a.dataInicio >= ${dataInicio}
      WHERE op.deleted_at IS NULL
      GROUP BY op.produto
      ORDER BY quantidade DESC
      LIMIT 5
    `;

    return (topProdutos as any[]).map((item) => ({
      produto: item.produto,
      quantidade: Number(item.quantidade),
      qualidade: Number((item.qualidade as number).toFixed(2)),
    }));
  }

  async getProducaoPorTurno(dias: number = 7) {
    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() - dias);
    dataInicio.setHours(0, 0, 0, 0);

    const producaoPorTurno = await this.prisma.$queryRaw`
      SELECT 
        DATE(a.dataInicio) as data,
        CASE 
          WHEN HOUR(a.dataInicio) BETWEEN 6 AND 13 THEN 'Manhã'
          WHEN HOUR(a.dataInicio) BETWEEN 14 AND 21 THEN 'Tarde'
          ELSE 'Noite'
        END as turno,
        SUM(a.quantidadeProduzida) as quantidade
      FROM apontamentos a
      WHERE a.dataInicio >= ${dataInicio}
      GROUP BY DATE(a.dataInicio), 
        CASE 
          WHEN HOUR(a.dataInicio) BETWEEN 6 AND 13 THEN 'Manhã'
          WHEN HOUR(a.dataInicio) BETWEEN 14 AND 21 THEN 'Tarde'
          ELSE 'Noite'
        END
      ORDER BY data, turno
    `;

    // Formatar para heatmap
    const heatmapData: { data: string; turno: string; quantidade: number }[] =
      [];
    const turnos = ['Manhã', 'Tarde', 'Noite'];

    for (let i = 0; i < dias; i++) {
      const data = new Date(dataInicio);
      data.setDate(data.getDate() + i);
      const dataStr = data.toISOString().split('T')[0];

      turnos.forEach((turno) => {
        const producao = (producaoPorTurno as any[]).find(
          (item) =>
            (item.data as Date).toISOString().split('T')[0] === dataStr &&
            item.turno === turno,
        );

        heatmapData.push({
          data: dataStr,
          turno,
          quantidade: producao ? Number(producao.quantidade) : 0,
        });
      });
    }

    return heatmapData;
  }

  async getAlertasCriticos() {
    const agora = new Date();

    // Máquinas paradas
    const maquinasParadas = await this.prisma.maquina.count({
      where: {
        status: StatusMaquina.PARADA,
        deleted_at: null,
      },
    });

    // OPs atrasadas
    const opsAtrasadas = await this.prisma.ordemProducao.count({
      where: {
        OR: [
          {
            dataFimPlanejado: {
              lt: agora,
            },
            status: {
              notIn: [StatusOP.FINALIZADA, StatusOP.CANCELADA],
            },
          },
          {
            status: StatusOP.ATRASADA,
          },
        ],
        deletedAt: null,
      },
    });

    // Taxa de defeitos alta
    const ultimas24h = new Date(agora.getTime() - 24 * 60 * 60 * 1000);
    const defeitosRecentes = await this.prisma.apontamento.aggregate({
      where: {
        dataInicio: {
          gte: ultimas24h,
        },
      },
      _sum: {
        quantidadeProduzida: true,
        quantidadeDefeito: true,
      },
    });

    const total = Number(defeitosRecentes._sum.quantidadeProduzida || 0);
    const defeitos = Number(defeitosRecentes._sum.quantidadeDefeito || 0);
    const taxaDefeitos = total > 0 ? (defeitos / total) * 100 : 0;

    return {
      maquinasParadas,
      opsAtrasadas,
      taxaDefeitosAlta: taxaDefeitos > 5,
      taxaDefeitos: Number(taxaDefeitos.toFixed(2)),
    };
  }

  async getMetasDia() {
    const agora = new Date();
    const inicioDia = new Date();
    inicioDia.setHours(0, 0, 0, 0);

    // Meta diária (simplificada - poderia vir de configuração)
    const metaDiaria = 1000;

    // Produção do dia
    const producaoDia = await this.prisma.apontamento.aggregate({
      where: {
        dataInicio: {
          gte: inicioDia,
        },
      },
      _sum: {
        quantidadeProduzida: true,
      },
    });

    const produzido = Number(producaoDia._sum.quantidadeProduzida || 0);
    const progresso = metaDiaria > 0 ? (produzido / metaDiaria) * 100 : 0;

    return {
      meta: metaDiaria,
      produzido,
      progresso: Number(progresso.toFixed(2)),
      faltante: Math.max(0, metaDiaria - produzido),
    };
  }

  async getEficienciaOperadores(periodo: string = 'semana') {
    let dataInicio: Date;

    switch (periodo) {
      case 'hoje':
        dataInicio = new Date();
        dataInicio.setHours(0, 0, 0, 0);
        break;
      case 'mes':
        dataInicio = new Date();
        dataInicio.setDate(dataInicio.getDate() - 30);
        break;
      default: // semana
        dataInicio = new Date();
        dataInicio.setDate(dataInicio.getDate() - 7);
    }

    const eficienciaOperadores = await this.prisma.$queryRaw`
      SELECT 
        u.nome,
        u.cargo,
        COUNT(a.id) as totalApontamentos,
        SUM(a.quantidadeProduzida) as totalProduzido,
        AVG(a.quantidadeProduzida) as mediaProducao,
        CASE 
          WHEN SUM(a.quantidadeProduzida) > 0 
          THEN (SUM(a.quantidadeProduzida) - SUM(a.quantidadeDefeito)) * 100.0 / SUM(a.quantidadeProduzida)
          ELSE 100 
        END as taxaQualidade
      FROM usuarios u
      LEFT JOIN apontamentos a ON u.id = a.usuarioId AND a.dataInicio >= ${dataInicio}
      WHERE u.deleted_at IS NULL
      GROUP BY u.id, u.nome, u.cargo
      HAVING totalApontamentos > 0
      ORDER BY mediaProducao DESC
      LIMIT 10
    `;

    return (eficienciaOperadores as any[]).map((item, index) => ({
      posicao: index + 1,
      nome: item.nome,
      cargo: item.cargo,
      totalApontamentos: Number(item.totalApontamentos),
      totalProduzido: Number(item.totalProduzido),
      mediaProducao: Number((item.mediaProducao as number)?.toFixed(2) || 0),
      taxaQualidade: Number((item.taxaQualidade as number).toFixed(2)),
    }));
  }
}
