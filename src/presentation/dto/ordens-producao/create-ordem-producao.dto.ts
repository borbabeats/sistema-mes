import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber, Min, IsDate } from 'class-validator';

export class CreateOrdemProducaoDto {
  @ApiProperty({ description: 'Código único da ordem de produção' })
  @IsNotEmpty()
  @IsString()
  codigo: string;

  @ApiProperty({ description: 'Nome do produto' })
  @IsNotEmpty()
  @IsString()
  produto: string;

  @ApiProperty({ description: 'Descrição do produto', required: false })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({ description: 'Quantidade planejada' })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantidadePlanejada: number;

  @ApiProperty({ 
    description: 'Prioridade da ordem',
    enum: ['BAIXA', 'MEDIA', 'ALTA', 'URGENTE'],
    default: 'MEDIA',
    required: false
  })
  @IsOptional()
  @IsString()
  prioridade?: string;

  @ApiProperty({ description: 'Data de início planejada', required: false })
  @IsOptional()
  @IsDate()
  dataInicioPlanejado?: Date;

  @ApiProperty({ description: 'Data de fim planejada', required: false })
  @IsOptional()
  @IsDate()
  dataFimPlanejado?: Date;

  @ApiProperty({ description: 'ID do setor' })
  @IsNotEmpty()
  @IsNumber()
  setorId: number;

  @ApiProperty({ description: 'ID do responsável', required: false })
  @IsOptional()
  @IsNumber()
  responsavelId?: number;

  @ApiProperty({ description: 'Observações', required: false })
  @IsOptional()
  @IsString()
  observacoes?: string;
}
