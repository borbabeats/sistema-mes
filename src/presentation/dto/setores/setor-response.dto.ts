import { ApiProperty } from '@nestjs/swagger';
import { UsuarioResponseDto } from '../usuarios/usuario-response.dto';

export class SetorResponseDto {
  @ApiProperty({ description: 'ID do setor' })
  id: number;

  @ApiProperty({ description: 'Nome do setor' })
  nome: string;

  @ApiProperty({ description: 'Quantidade de usuários no setor' })
  qtdUsuarios?: number;

  @ApiProperty({ description: 'Quantidade de máquinas no setor' })
  qtdMaquinas?: number;

  @ApiProperty({ description: 'Lista de usuários do setor', type: [UsuarioResponseDto] })
  usuarios?: UsuarioResponseDto[];

  @ApiProperty({ description: 'Lista de máquinas do setor' })
  maquinas?: any[];

  @ApiProperty({ description: 'Data de criação' })
  created_at: Date;

  @ApiProperty({ description: 'Data de atualização' })
  updated_at: Date;

  @ApiProperty({ description: 'Data de exclusão (soft delete)' })
  deleted_at?: Date | null;
}
