import { IsOptional, IsEnum, IsBoolean, IsInt } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export enum StatusOP {
  RASCUNHO = 'RASCUNHO',
  PLANEJADA = 'PLANEJADA',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  PAUSADA = 'PAUSADA',
  FINALIZADA = 'FINALIZADA',
  CANCELADA = 'CANCELADA',
  ATRASADA = 'ATRASADA',
}

export class FilterApontamentosDto {
  @ApiPropertyOptional({
    description: 'ID da Ordem de Produção',
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  opId?: number;

  @ApiPropertyOptional({
    description: 'ID da Máquina',
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  maquinaId?: number;

  @ApiPropertyOptional({
    description: 'ID do Usuário',
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  usuarioId?: number;

  @ApiPropertyOptional({
    description: 'Data de início',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  dataInicio?: Date;

  @ApiPropertyOptional({
    description: 'Data de fim',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  dataFim?: Date;

  @ApiPropertyOptional({
    description: 'Status da Ordem de Produção',
    enum: StatusOP,
  })
  @IsOptional()
  @IsEnum(StatusOP)
  status?: StatusOP;

  @ApiPropertyOptional({
    description: 'ID do Setor',
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  setorId?: number;

  @ApiPropertyOptional({
    description: 'Se o apontamento está ativo (em andamento)',
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  ativo?: boolean;
}
