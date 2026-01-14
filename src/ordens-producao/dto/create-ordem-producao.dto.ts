import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { PrioridadeOP, StatusOP } from '@prisma/client';

export class CreateOrdemProducaoDto {
  @ApiProperty({ description: 'Código único da ordem de produção' })
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @ApiProperty({ description: 'Nome do produto a ser produzido' })
  @IsString()
  @IsNotEmpty()
  produto: string;

  @ApiProperty({ description: 'Descrição detalhada da ordem de produção', required: false })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiProperty({ description: 'Quantidade planejada para produção' })
  @IsInt()
  @IsNotEmpty()
  quantidadePlanejada: number;

  @ApiProperty({ enum: PrioridadeOP, default: 'MEDIA' })
  @IsEnum(PrioridadeOP)
  @IsOptional()
  prioridade?: PrioridadeOP;

  @ApiProperty({ description: 'Data de início' })
  @IsDateString()
  @IsNotEmpty()
  dataInicio: Date;

  @ApiProperty({ description: 'Data de término' })
  @IsDateString()
  @IsNotEmpty()
  dataFim: Date;

  @ApiProperty({ description: 'ID do setor responsável' })
  @IsInt()
  @IsNotEmpty()
  setorId: number;

  @ApiProperty({ description: 'ID do responsável pela ordem', required: false })
  @IsInt()
  @IsOptional()
  responsavelId?: number;

  @ApiProperty({ description: 'IDs dos operadores alocados', type: [Number], required: false })
  @IsInt({ each: true })
  @IsOptional()
  operadoresIds?: number[];

  @ApiProperty({ description: 'Observações adicionais', required: false })
  @IsString()
  @IsOptional()
  observacoes?: string;
}