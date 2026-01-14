import { PartialType } from '@nestjs/swagger';
import { CreateOrdemProducaoDto } from './create-ordem-producao.dto';
import { StatusOP } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsOptional } from 'class-validator';

export class UpdateOrdemProducaoDto extends PartialType(CreateOrdemProducaoDto) {
  @ApiProperty({ enum: StatusOP, required: false })
  @IsEnum(StatusOP)
  @IsOptional()
  status?: StatusOP;

  @ApiProperty({ description: 'Quantidade já produzida', required: false })
  @IsInt()
  @IsOptional()
  quantidadeProduzida?: number;

  @ApiProperty({ description: 'Data real de início da produção', required: false })
  @IsDateString()
  @IsOptional()
  dataInicioReal?: Date;

  @ApiProperty({ description: 'Data real de finalização da produção', required: false })
  @IsDateString()
  @IsOptional()
  dataFimReal?: Date;
}