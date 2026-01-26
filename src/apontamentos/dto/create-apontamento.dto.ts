import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsDateString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateApontamentoDto {
  @ApiProperty({ description: 'ID da ordem de produção' })
  @IsNumber()
  @IsNotEmpty()
  opId: number;

  @ApiProperty({ description: 'ID da máquina' })
  @IsNumber()
  @IsNotEmpty()
  maquinaId: number;

  @ApiProperty({ description: 'ID do usuário/operador' })
  @IsNumber()
  @IsNotEmpty()
  usuarioId: number;

  @ApiProperty({ 
    description: 'Quantidade produzida',
    default: 0 
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  quantidadeProduzida?: number;

  @ApiProperty({ 
    description: 'Quantidade de defeitos',
    default: 0 
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  quantidadeDefeito?: number;

  @ApiProperty({ description: 'Data e hora de início do apontamento' })
  @IsDateString()
  @IsNotEmpty()
  dataInicio: Date;

  @ApiProperty({ 
    description: 'Data e hora de fim do apontamento',
    required: false 
  })
  @IsDateString()
  @IsOptional()
  dataFim?: Date;
}
