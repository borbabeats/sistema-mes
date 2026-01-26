import { ApiProperty } from '@nestjs/swagger';
import { Setor } from '../../setores/entities/setor.entity';

export enum Cargo {
  ADMIN = 'ADMIN',
  GERENTE = 'GERENTE', 
  OPERADOR = 'OPERADOR'
}

export class Usuario {
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
  cargo: Cargo;

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