import { ApiProperty } from '@nestjs/swagger';
import { Cargo } from '../../../domain/entities/usuario.entity';

export class UsuarioResponseDto {
  @ApiProperty({ description: 'ID do usuário' })
  id: number;

  @ApiProperty({ description: 'Nome do usuário' })
  nome: string;

  @ApiProperty({ description: 'Email do usuário' })
  email: string;

  @ApiProperty({ description: 'Telefone do usuário' })
  telefone: string;

  @ApiProperty({
    description: 'Cargo do usuário',
    enum: ['ADMIN', 'GERENTE', 'OPERADOR'],
  })
  cargo?: Cargo;

  @ApiProperty({ description: 'Turno de trabalho' })
  turno?: string;

  @ApiProperty({ description: 'URL da foto de perfil' })
  photoProfile?: string;

  @ApiProperty({ description: 'ID do setor' })
  setorId?: number;

  @ApiProperty({ description: 'Nome do setor' })
  nomeSetor?: string;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização' })
  updatedAt: Date;

  @ApiProperty({ description: 'Data de exclusão (soft delete)' })
  deletedAt?: Date;
}
