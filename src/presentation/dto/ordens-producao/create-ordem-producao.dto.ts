import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber, Min, IsDateString, IsEnum } from 'class-validator';
import { OrigemOP, PrioridadeOP } from '../../../domain/entities/ordem-producao.entity';

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
  @IsDateString()
  dataInicioPlanejado?: string;

  @ApiProperty({ description: 'Data de fim planejada', required: false })
  @IsOptional()
  @IsDateString()
  dataFimPlanejado?: string;

  @ApiProperty({ description: 'ID do setor' })
  @IsNotEmpty()
  @IsNumber()
  setorId: number;

  @ApiProperty({ description: 'ID do responsável', required: false })
  @IsOptional()
  @IsNumber()
  responsavelId?: number;

  @ApiProperty({ 
    description: 'Tipo de origem da ordem de produção',
    enum: ['PEDIDO_VENDA', 'REPOSICAO_ESTOQUE', 'PLANO_MESTRE_PRODUCAO', 'DEMANDA_INTERNA', 'PREVISAO_VENDAS'],
    default: 'PEDIDO_VENDA',
    required: false
  })
  @IsOptional()
  @IsEnum(OrigemOP)
  origemTipo?: OrigemOP;

  @ApiProperty({ 
    description: 'ID da origem (ex: número do pedido, código do item, etc.)',
    required: false
  })
  @IsOptional()
  @IsString()
  origemId?: string;

  @ApiProperty({ description: 'Observações', required: false })
  @IsOptional()
  @IsString()
  observacoes?: string;
}
