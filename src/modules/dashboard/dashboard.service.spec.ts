import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('DashboardService - getComparativoTurnos', () => {
  let service: DashboardService;
  let prisma: { $queryRaw: jest.Mock };

  beforeEach(async () => {
    prisma = {
      $queryRaw: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar os 3 turnos usando o período padrão de 7 dias quando "dias" não é informado', async () => {
    prisma.$queryRaw.mockResolvedValue([
      { turno: 'Manhã', quantidade: 100 },
      { turno: 'Tarde', quantidade: 50 },
      { turno: 'Noite', quantidade: 10 },
    ]);

    const resultado = await service.getComparativoTurnos();

    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
    expect(resultado).toEqual([
      { turno: 'Manhã', quantidade: 100 },
      { turno: 'Tarde', quantidade: 50 },
      { turno: 'Noite', quantidade: 10 },
    ]);
  });

  it('deve considerar um período customizado quando "dias" é informado', async () => {
    prisma.$queryRaw.mockResolvedValue([
      { turno: 'Manhã', quantidade: 900 },
      { turno: 'Tarde', quantidade: 700 },
      { turno: 'Noite', quantidade: 300 },
    ]);

    const resultado = await service.getComparativoTurnos(30);

    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
    expect(resultado).toEqual([
      { turno: 'Manhã', quantidade: 900 },
      { turno: 'Tarde', quantidade: 700 },
      { turno: 'Noite', quantidade: 300 },
    ]);
  });

  it('deve retornar quantidade 0 para um turno sem produção no período, sem omiti-lo', async () => {
    prisma.$queryRaw.mockResolvedValue([
      { turno: 'Manhã', quantidade: 100 },
      { turno: 'Tarde', quantidade: 50 },
      // Noite ausente do resultado da query
    ]);

    const resultado = await service.getComparativoTurnos();

    expect(resultado).toHaveLength(3);
    expect(resultado).toEqual([
      { turno: 'Manhã', quantidade: 100 },
      { turno: 'Tarde', quantidade: 50 },
      { turno: 'Noite', quantidade: 0 },
    ]);
  });

  it.each([0, -5, NaN])(
    'deve aplicar o padrão de 7 dias quando "dias" é inválido (%p), sem lançar erro',
    async (diasInvalido) => {
      prisma.$queryRaw.mockResolvedValue([]);

      const resultado = await service.getComparativoTurnos(diasInvalido);

      expect(resultado).toEqual([
        { turno: 'Manhã', quantidade: 0 },
        { turno: 'Tarde', quantidade: 0 },
        { turno: 'Noite', quantidade: 0 },
      ]);
    },
  );

  it('deve retornar sempre exatamente 3 registros, mesmo sem nenhuma produção no período', async () => {
    prisma.$queryRaw.mockResolvedValue([]);

    const resultado = await service.getComparativoTurnos();

    expect(resultado).toHaveLength(3);
    expect(resultado.map((r) => r.turno)).toEqual(['Manhã', 'Tarde', 'Noite']);
    expect(resultado.every((r) => r.quantidade === 0)).toBe(true);
  });
});
