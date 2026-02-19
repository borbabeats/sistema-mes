import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');
  
  try {
    // Test connection
    await prisma.$connect();
    console.log('✅ Conectado ao banco de dados com sucesso');
    
    // Limpar dados existentes (cuidado em produção!)
    console.log('🗑️  Limpando dados existentes...');
    await prisma.apontamento.deleteMany();
    await prisma.ordemProducao.deleteMany();
    await prisma.manutencao.deleteMany();
    await prisma.maquina.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.setor.deleteMany();

    // 1. Create setores
    console.log('📦 Criando setores...');
    const setoresData = [
      { nome: 'Usinagem' },
      { nome: 'Soldagem' },
      { nome: 'Montagem' }
    ];

    const setores: any[] = [];
    for (const data of setoresData) {
      const setor = await prisma.setor.create({ data });
      setores.push(setor);
    }
    console.log(`✅ ${setores.length} setores criados`);

    // Hash password
    const hashedPassword = await bcrypt.hash('senha123', 10);

    // 2. Create users (admin, gerentes e operadores)
    console.log('👥 Criando usuários...');
    const usuarios: any[] = [];
    let usuarioId = 1;

    // Criar usuário ADMIN
    const admin = await prisma.usuario.create({
      data: {
        nome: 'Administrador Sistema',
        email: 'admin@mes.com',
        telefone: '11999999999',
        senha: hashedPassword,
        cargo: 'ADMIN',
        setor_id: null, // Admin não está vinculado a setor específico
      },
    });
    usuarios.push(admin);
    usuarioId++;
    console.log('✅ Usuário ADMIN criado');

    for (let i = 0; i < setores.length; i++) {
      const setor = setores[i];

      // Criar gerente para cada setor
      const gerente = await prisma.usuario.create({
        data: {
          nome: `Gerente ${setor.nome}`,
          email: `gerente.${setor.nome.toLowerCase()}@empresa.com`,
          telefone: `11999${String(i).padStart(6, '0')}`,
          senha: hashedPassword,
          cargo: 'GERENTE',
          setor_id: setor.id,
        },
      });
      usuarios.push(gerente);
      usuarioId++;

      // Criar 2 operadores para cada setor
      for (let j = 1; j <= 2; j++) {
        const operador = await prisma.usuario.create({
          data: {
            nome: `Operador ${j} - ${setor.nome}`,
            email: `operador${j}.${setor.nome.toLowerCase()}@empresa.com`,
            telefone: `11998${String(i * 10 + j).padStart(6, '0')}`,
            senha: hashedPassword,
            cargo: 'OPERADOR',
            turno: 'MANHA',
            setor_id: setor.id,
          },
        });
        usuarios.push(operador);
        usuarioId++;
      }
    }
    console.log(`✅ ${usuarios.length} usuários criados`);

    // 3. Create máquinas
    console.log('🔧 Criando máquinas...');
    const maquinas: any[] = [];

    // Usinagem
    const maq1 = await prisma.maquina.create({
      data: {
        codigo: 'USINA-001',
        nome: 'Torno CNC Vertical',
        descricao: 'Torno CNC para usinagem de peças complexas',
        fabricante: 'ROMI',
        modelo: 'GL-320E',
        numeroSerie: 'SN-2023-001',
        anoFabricacao: 2023,
        capacidade: 'Até 320mm',
        status: 'DISPONIVEL',
        horasUso: 2450,
        setor_id: setores[0].id,
      },
    });
    maquinas.push(maq1);

    // Soldagem
    const maq2 = await prisma.maquina.create({
      data: {
        codigo: 'SOLD-001',
        nome: 'Robô Soldador',
        descricao: 'Robô soldador para soldagem de estruturas',
        fabricante: 'FANUC',
        modelo: 'M-710iC/50',
        numeroSerie: 'SN-2023-002',
        anoFabricacao: 2022,
        capacidade: 'Até 50kg',
        status: 'EM_USO',
        horasUso: 3200,
        setor_id: setores[1].id,
      },
    });
    maquinas.push(maq2);

    // Montagem
    const maq3 = await prisma.maquina.create({
      data: {
        codigo: 'MONT-001',
        nome: 'Prensa Pneumática',
        descricao: 'Prensa pneumática para montagem de componentes',
        fabricante: 'SMC',
        modelo: 'HLF500-3',
        numeroSerie: 'SN-2023-003',
        anoFabricacao: 2021,
        capacidade: 'Até 500 ton',
        status: 'DISPONIVEL',
        horasUso: 1850,
        setor_id: setores[2].id,
      },
    });
    maquinas.push(maq3);

    console.log(`✅ ${maquinas.length} máquinas criadas`);

    // 4. Create ordens de produção
    console.log('📋 Criando ordens de produção...');
    const ordensProducao: any[] = [];
    const ordens: any[] = [];
    const agora = new Date();

    // OP1 - Usinagem (Finalizada)
    const op1 = await prisma.ordemProducao.create({
      data: {
        codigo: 'OP-2024-001',
        produto: 'Eixo de Transmissão',
        descricao: 'Eixo principal para caixa de velocidades',
        quantidadePlanejada: 100,
        quantidadeProduzida: 100,
        status: 'FINALIZADA',
        prioridade: 'ALTA',
        origemTipo: 'PEDIDO_VENDA',
        origemId: 'PV-2024-0001',
        dataInicioPlanejado: new Date(agora.getTime() - 7 * 24 * 60 * 60 * 1000),
        dataFimPlanejado: new Date(agora.getTime() - 1 * 24 * 60 * 60 * 1000),
        dataInicioReal: new Date(agora.getTime() - 6 * 24 * 60 * 60 * 1000),
        dataFimReal: new Date(agora.getTime() - 1 * 24 * 60 * 60 * 1000),
        setorId: setores[0].id,
        responsavelId: usuarios[0].id,
        operadores: {
          connect: [
            { id: usuarios[1].id },
            { id: usuarios[2].id },
          ],
        },
      },
    });
    ordens.push(op1);

    // OP2 - Usinagem (Em Andamento)
    const op2 = await prisma.ordemProducao.create({
      data: {
        codigo: 'OP-2024-002',
        produto: 'Cilindro de Compressão',
        descricao: 'Cilindro principal do motor',
        quantidadePlanejada: 50,
        quantidadeProduzida: 42,
        status: 'EM_ANDAMENTO',
        prioridade: 'URGENTE',
        origemTipo: 'REPOSICAO_ESTOQUE',
        origemId: 'ESTOQUE_MIN-CILINDRO_COMP',
        dataInicioPlanejado: new Date(agora.getTime() - 3 * 24 * 60 * 60 * 1000),
        dataFimPlanejado: new Date(agora.getTime() + 2 * 24 * 60 * 60 * 1000),
        dataInicioReal: new Date(agora.getTime() - 2 * 24 * 60 * 60 * 1000),
        setorId: setores[0].id,
        responsavelId: usuarios[0].id,
        operadores: {
          connect: [{ id: usuarios[1].id }],
        },
      },
    });
    ordens.push(op2);

    // OP3 - Soldagem (Finalizada)
    const op3 = await prisma.ordemProducao.create({
      data: {
        codigo: 'OP-2024-003',
        produto: 'Estrutura Metálica A',
        descricao: 'Estrutura soldada para chassis',
        quantidadePlanejada: 30,
        quantidadeProduzida: 30,
        status: 'FINALIZADA',
        prioridade: 'MEDIA',
        origemTipo: 'DEMANDA_INTERNA',
        origemId: 'ENG-CHASSIS-A',
        dataInicioPlanejado: new Date(agora.getTime() - 5 * 24 * 60 * 60 * 1000),
        dataFimPlanejado: new Date(agora.getTime() - 2 * 24 * 60 * 60 * 1000),
        dataInicioReal: new Date(agora.getTime() - 4 * 24 * 60 * 60 * 1000),
        dataFimReal: new Date(agora.getTime() - 2 * 24 * 60 * 60 * 1000),
        setorId: setores[1].id,
        responsavelId: usuarios[3].id,
        operadores: {
          connect: [
            { id: usuarios[4].id },
            { id: usuarios[5].id },
          ],
        },
      },
    });
    ordens.push(op3);

    // OP4 - Soldagem (Em Andamento)
    const op4 = await prisma.ordemProducao.create({
      data: {
        codigo: 'OP-2024-004',
        produto: 'Estrutura Metálica B',
        descricao: 'Estrutura soldada para suporte',
        quantidadePlanejada: 25,
        quantidadeProduzida: 18,
        status: 'EM_ANDAMENTO',
        prioridade: 'MEDIA',
        origemTipo: 'PLANO_MESTRE_PRODUCAO',
        origemId: 'PMP-2024-W08',
        dataInicioPlanejado: new Date(agora.getTime() - 2 * 24 * 60 * 60 * 1000),
        dataFimPlanejado: new Date(agora.getTime() + 3 * 24 * 60 * 60 * 1000),
        dataInicioReal: new Date(agora.getTime() - 1 * 24 * 60 * 60 * 1000),
        setorId: setores[1].id,
        responsavelId: usuarios[3].id,
        operadores: {
          connect: [{ id: usuarios[4].id }],
        },
      },
    });
    ordens.push(op4);

    // OP5 - Montagem (Planejada)
    const op5 = await prisma.ordemProducao.create({
      data: {
        codigo: 'OP-2024-005',
        produto: 'Motor Elétrico Montado',
        descricao: 'Montagem completa do motor',
        quantidadePlanejada: 20,
        quantidadeProduzida: 0,
        status: 'PLANEJADA',
        prioridade: 'ALTA',
        origemTipo: 'PREVISAO_VENDAS',
        origemId: 'FORECAST-MOTOR-2024Q1',
        dataInicioPlanejado: new Date(agora.getTime() + 1 * 24 * 60 * 60 * 1000),
        dataFimPlanejado: new Date(agora.getTime() + 5 * 24 * 60 * 60 * 1000),
        setorId: setores[2].id,
        responsavelId: usuarios[6].id,
        operadores: {
          connect: [
            { id: usuarios[7].id },
            { id: usuarios[8].id },
          ],
        },
      },
    });
    ordens.push(op5);

    console.log(`✅ ${ordens.length} ordens de produção criadas`);

    // 5. Create apontamentos
    console.log('📊 Criando apontamentos...');
    const apontamentos: any[] = [];

    // Apontamentos OP1
    for (let i = 0; i < 3; i++) {
      const dataInicio = new Date(agora.getTime() - (5 - i) * 24 * 60 * 60 * 1000 + i * 2 * 60 * 60 * 1000);
      const dataFim = new Date(dataInicio.getTime() + 8 * 60 * 60 * 1000);
      
      await prisma.apontamento.create({
        data: {
          opId: op1.id,
          maquinaId: maq1.id,
          usuarioId: usuarios[1 + (i % 2)].id,
          quantidadeProduzida: 33,
          quantidadeDefeito: i === 1 ? 2 : 0,
          dataInicio,
          dataFim,
        },
      });
      apontamentos.push({ opId: op1.id });
    }

    // Apontamentos OP2
    for (let i = 0; i < 2; i++) {
      const dataInicio = new Date(agora.getTime() - (1 - i) * 24 * 60 * 60 * 1000);
      const dataFim = i === 1 ? null : new Date(dataInicio.getTime() + 8 * 60 * 60 * 1000);
      
      await prisma.apontamento.create({
        data: {
          opId: op2.id,
          maquinaId: maq1.id,
          usuarioId: usuarios[1].id,
          quantidadeProduzida: 21,
          quantidadeDefeito: 0,
          dataInicio,
          dataFim,
        },
      });
      apontamentos.push({ opId: op2.id });
    }

    // Apontamentos OP3
    for (let i = 0; i < 2; i++) {
      const dataInicio = new Date(agora.getTime() - (3 - i) * 24 * 60 * 60 * 1000);
      const dataFim = new Date(dataInicio.getTime() + 12 * 60 * 60 * 1000);
      
      await prisma.apontamento.create({
        data: {
          opId: op3.id,
          maquinaId: maq2.id,
          usuarioId: usuarios[4 + (i % 2)].id,
          quantidadeProduzida: 15,
          quantidadeDefeito: 0,
          dataInicio,
          dataFim,
        },
      });
      apontamentos.push({ opId: op3.id });
    }

    // Apontamentos OP4
    for (let i = 0; i < 2; i++) {
      const dataInicio = new Date(agora.getTime() - (1 - i) * 24 * 60 * 60 * 1000 + i * 6 * 60 * 60 * 1000);
      const dataFim = i === 1 ? null : new Date(dataInicio.getTime() + 10 * 60 * 60 * 1000);
      
      await prisma.apontamento.create({
        data: {
          opId: op4.id,
          maquinaId: maq2.id,
          usuarioId: usuarios[4].id,
          quantidadeProduzida: 9,
          quantidadeDefeito: 0,
          dataInicio,
          dataFim,
        },
      });
      apontamentos.push({ opId: op4.id });
    }

    console.log(`✅ ${apontamentos.length} apontamentos criados`);

    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🎉 Seed concluído com sucesso!');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    console.log('📊 Resumo:');
    console.log(`  ✓ ${setores.length} Setores (Usinagem, Soldagem, Montagem)`);
    console.log(`  ✓ ${usuarios.length} Usuários (1 ADMIN + 3 gerentes + 6 operadores)`);
    console.log(`  ✓ ${maquinas.length} Máquinas (1 por setor)`);
    console.log(`  ✓ ${ordens.length} Ordens de Produção (2 finalizadas, 2 em andamento, 1 planejada)`);
    console.log(`  ✓ ${apontamentos.length} Apontamentos de Produção`);
    console.log('');
    console.log('🔑 Credenciais:');
    console.log('  Email: gerente.usinagem@empresa.com (ou qualquer gerente)');
    console.log('  Senha: senha123');
    console.log('');
  } catch (error) {
    console.error('❌ Erro durante seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Fatal error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });