import { ApiProperty } from '@nestjs/swagger';
import { PrioridadeOP, OrdemProducao as PrismaOrdemProducao, StatusOP } from '@prisma/client';
import { Usuario } from '../../users/entities/user.entity';
import { Setor } from '../../setores/entities/setor.entity';

export class OrdemProducao implements PrismaOrdemProducao {
  @ApiProperty()
  id: number;

  @ApiProperty()
  codigo: string;

  @ApiProperty()
  produto: string;

  @ApiProperty({ required: false, nullable: true })
  descricao: string | null;

  @ApiProperty()
  quantidadePlanejada: number;

  @ApiProperty()
  quantidadeProduzida: number;

  @ApiProperty()
  status: StatusOP;

  @ApiProperty()
  prioridade: PrioridadeOP;

  @ApiProperty({ required: false, nullable: true })
  dataFimReal: Date | null;

  @ApiProperty({ required: false, nullable: true })
  dataInicioReal: Date | null;

  @ApiProperty({ required: false, nullable: true })
  dataInicioPlanejado: Date | null;

  @ApiProperty({ required: false, nullable: true })
  dataFimPlanejado: Date | null;

  @ApiProperty()
  setorId: number;

  @ApiProperty({ required: false })
  responsavelId: number | null;

  @ApiProperty({ required: false })
  observacoes: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ required: false })
  deletedAt: Date | null;

  // Relations
  @ApiProperty({ type: () => Setor, required: false })
  setor?: Setor;

  @ApiProperty({ type: () => Usuario, required: false })
  responsavel?: Usuario | null;

  @ApiProperty({ type: () => [Usuario], required: false })
  operadores?: Usuario[];

  constructor(partial: Partial<OrdemProducao>) {
    Object.assign(this, partial);
  }
}