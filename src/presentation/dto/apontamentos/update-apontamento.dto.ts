import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsDateString, Min } from 'class-validator';

export class UpdateApontamentoDto {
  @ApiProperty({
    description: 'ID da ordem de produção relacionada',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  opId?: number;

  @ApiProperty({ description: 'ID da máquina', required: false })
  @IsOptional()
  @IsNumber()
  maquinaId?: number;

  @ApiProperty({ description: 'ID do usuário/operador', required: false })
  @IsOptional()
  @IsNumber()
  usuarioId?: number;

  @ApiProperty({
    description: 'Data e hora de início do apontamento',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dataInicio?: string;

  @ApiProperty({
    description: 'Data e hora de fim do apontamento',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  dataFim?: string | null;

  @ApiProperty({
    description: 'Quantidade produzida no apontamento',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantidadeProduzida?: number;

  @ApiProperty({
    description: 'Quantidade de defeitos detectados',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantidadeDefeito?: number;
}
