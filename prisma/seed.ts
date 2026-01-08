import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import mariadb from 'mariadb';
import * as bcrypt from 'bcrypt';

// Create adapter with connection config
const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3307'),
  user: process.env.DB_USERNAME || 'mes_user',
  password: process.env.DB_PASSWORD || 'mes123',
  database: process.env.DB_DATABASE || 'mes_system',
  allowPublicKeyRetrieval: true,
  ssl: false
});

// Initialize Prisma Client with adapter for Prisma 7.2
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting seed...');
  
  try {
    // Test connection
    await prisma.$connect();
    console.log('Successfully connected to the database');
    
    // Create setores
    const setores = await prisma.setor.createMany({
      data: [
        { nome: 'Produção' },
        { nome: 'Montagem' },
        { nome: 'Qualidade' },
        { nome: 'Manutenção' }
      ],
      skipDuplicates: true,
    });

    console.log('Setores created:', setores);

    // Hash password
    const hashedPassword = await bcrypt.hash('123456', 10);

    // Create users
    const users = await prisma.usuario.createMany({
      data: [
        {
          nome: 'Administrador',
          email: 'admin@mes.com',
          telefone: '11999999999',
          cargo: 'ADMIN',
          setor_id: 1,
          senha: hashedPassword
        },
        {
          nome: 'Gerente Produção',
          email: 'gerente@mes.com',
          telefone: '11988888888',
          cargo: 'GERENTE',
          setor_id: 1,
          senha: hashedPassword
        },
        {
          nome: 'Operador 1',
          email: 'operador1@mes.com',
          telefone: '11977777777',
          cargo: 'OPERADOR',
          setor_id: 1,
          senha: hashedPassword
        },
        {
          nome: 'Operador 2',
          email: 'operador2@mes.com',
          telefone: '11966666666',
          cargo: 'OPERADOR',
          setor_id: 1,
          senha: hashedPassword
        }
      ],
      skipDuplicates: true,
    });

    console.log('Users created:', users);
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
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