import { ApiProperty } from '@nestjs/swagger';
import { Setor as PrismaSetor } from '@prisma/client';
import { Usuario } from '../../users/entities/user.entity';

export class Setor implements PrismaSetor {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nome: string;

  @ApiProperty({ type: () => [Usuario], required: false })
  usuarios?: Usuario[];

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty({ required: false, nullable: true })
  deleted_at: Date | null;
}