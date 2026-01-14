import { ApiProperty } from '@nestjs/swagger';
import { Usuario as PrismaUsuario } from '@prisma/client';
import { Setor } from '../../setores/entities/setor.entity';

export class Usuario implements PrismaUsuario {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nome: string;

  @ApiProperty({ required: false, nullable: true })
  email: string | null;

  @ApiProperty({ required: false, nullable: true })
  telefone: string | null;

  @ApiProperty()
  senha: string;

  @ApiProperty({ enum: ['ADMIN', 'GERENTE', 'OPERADOR'] })
  cargo: 'ADMIN' | 'GERENTE' | 'OPERADOR';

  @ApiProperty({ required: false, nullable: true })
  photo_profile: string | null;

  @ApiProperty({ required: false, nullable: true })
  setor_id: number | null;

  @ApiProperty({ type: () => Setor, required: false, nullable: true })
  setor?: Setor | null;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty({ required: false, nullable: true })
  deleted_at: Date | null;
}