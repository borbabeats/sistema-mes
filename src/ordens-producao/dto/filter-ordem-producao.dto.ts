import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsDateString, IsInt } from 'class-validator';
import { StatusOP, PrioridadeOP } from '@prisma/client';

export class FilterOrdemProducaoDto {
  @ApiProperty({ required: false })

  @IsOptional()
  search?: string;

  @ApiProperty({ enum: StatusOP, required: false })
  @IsEnum(StatusOP)
  @IsOptional()
  status?: StatusOP;

  @ApiProperty({ enum: PrioridadeOP, required: false })
  @IsEnum(PrioridadeOP)
  @IsOptional()
  prioridade?: PrioridadeOP;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  setorId?: number;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  responsavelId?: number;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  dataInicio?: Date;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  dataFim?: Date;
}