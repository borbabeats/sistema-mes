import { ApiProperty } from '@nestjs/swagger';
import { Setor } from '../../setores/entities/setor.entity';

export enum Cargo {
  ADMIN = 'ADMIN',
  GERENTE = 'GERENTE',
  OPERADOR = 'OPERADOR',
}

export class Usuario {
  @ApiProperty({ description: 'ID do usuário' })
  id: number;

  @ApiProperty({ description: 'Nome completo do usuário' })
  nome: string;

  @ApiProperty({ description: 'E-mail do usuário', required: false })
  email?: string;

  @ApiProperty({ description: 'Telefone do usuário', required: false })
  telefone?: string;

  @ApiProperty({ description: 'Senha do usuário (apenas para criação/atualização)' })
  senha: string;

  @ApiProperty({ 
    description: 'Cargo do usuário',
    enum: Cargo,
    default: Cargo.OPERADOR 
  })
  cargo: Cargo;

  @ApiProperty({ 
    description: 'URL da foto de perfil do usuário',
    required: false 
  })
  photoProfile?: string;

  @ApiProperty({ 
    description: 'Setor ao qual o usuário pertence',
    type: () => Setor,
    required: false 
  })
  setor?: Setor;

  @ApiProperty({ 
    description: 'ID do setor',
    required: false 
  })
  setorId?: number;

  @ApiProperty({ 
    description: 'Data de criação do registro',
    type: Date 
  })
  createdAt: Date;

  @ApiProperty({ 
    description: 'Data da última atualização do registro',
    type: Date 
  })
  updatedAt: Date;

  @ApiProperty({ 
    description: 'Data de remoção do registro (soft delete)',
    type: Date,
    required: false 
  })
  deletedAt?: Date;
}
