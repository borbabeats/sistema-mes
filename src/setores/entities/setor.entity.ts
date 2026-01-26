import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../users/entities/user.entity';

export class Setor {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nome: string;

  @ApiProperty({ type: () => [Usuario], required: false })
  usuarios?: Usuario[];

  @ApiProperty({ required: false })
  maquinas?: any[];

  @ApiProperty({ required: false })
  qtdUsuarios?: number;

  @ApiProperty({ required: false })
  qtdMaquinas?: number;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty({ required: false, nullable: true })
  deleted_at: Date | null;
}