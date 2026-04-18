-- Reset completo do banco de dados para RDS
-- ATENÇÃO: Isso vai apagar todos os dados!

DROP DATABASE IF EXISTS mes_system;
CREATE DATABASE mes_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Agora rode: prisma migrate deploy
-- Depois: npm run seed (se tiver seed script)
