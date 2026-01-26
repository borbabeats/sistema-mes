import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsNumber } from 'class-validator';

export enum StatusOrdemProducao {
  PENDENTE = 'PENDENTE',
  EM_PRODUCAO = 'EM_PRODUCAO',
  PAUSADA = 'PAUSADA',
  FINALIZADA = 'FINALIZADA',
  CANCELADA = 'CANCELADA',
}

export class FilterOrdemProducaoDto {
  @ApiProperty({ description: 'Código da ordem de produção', required: false })
  @IsOptional()
  @IsString()
  codigo?: string;

  @ApiProperty({ 
    description: 'Status da ordem de produção', 
    enum: StatusOrdemProducao,
    required: false 
  })
  @IsOptional()
  @IsEnum(StatusOrdemProducao)
  status?: StatusOrdemProducao;

  @ApiProperty({ description: 'ID da máquina', required: false })
  @IsOptional()
  @IsNumber()
  maquinaId?: number;

  @ApiProperty({ description: 'ID do setor', required: false })
  @IsOptional()
  @IsNumber()
  setorId?: number;
}
