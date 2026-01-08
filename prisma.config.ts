import 'dotenv/config'  // Carrega as variáveis do .env
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',  // Caminho para o schema (geralmente assim)
  datasource: {
    url: env('DATABASE_URL')  // Move a conexão para cá
  },
  migrations: {
    seed: 'ts-node prisma/seed.ts'
  }
})