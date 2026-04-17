import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsOptional, Min, IsDateString } from 'class-validator';

export class CreateApontamentoDto {
  @ApiProperty({ description: 'ID da ordem de produção relacionada' })
  @IsNotEmpty()
  @IsNumber()
  opId: number;

  @ApiProperty({ description: 'ID da máquina' })
  @IsNotEmpty()
  @IsNumber()
  maquinaId: number;

  @ApiProperty({ description: 'ID do usuário/operador' })
  @IsNotEmpty()
  @IsNumber()
  usuarioId: number;

  @ApiProperty({ 
    description: 'Quantidade produzida no apontamento',
    default: 0,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantidadeProduzida?: number;

  @ApiProperty({ 
    description: 'Quantidade de defeitos detectados',
    default: 0,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantidadeDefeito?: number;

  @ApiProperty({ description: 'Data e hora de início do apontamento' })
  @IsNotEmpty()
  @IsDateString()
  dataInicio: string;

  @ApiProperty({ 
    description: 'Data e hora de fim do apontamento', 
    required: false,
    nullable: true
  })
  @IsOptional()
  @IsDateString()
  dataFim?: string | null;
}
