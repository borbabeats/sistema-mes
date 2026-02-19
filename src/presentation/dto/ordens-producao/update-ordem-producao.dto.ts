import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min, IsDateString, IsEnum } from 'class-validator';
import { OrigemOP } from '../../../domain/entities/ordem-producao.entity';

export class UpdateOrdemProducaoDto {
  @ApiProperty({ description: 'Código único da ordem de produção', required: false })
  @IsOptional()
  @IsString()
  codigo?: string;

  @ApiProperty({ description: 'Nome do produto', required: false })
  @IsOptional()
  @IsString()
  produto?: string;

  @ApiProperty({ description: 'Descrição do produto', required: false })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({ description: 'Quantidade planejada', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantidadePlanejada?: number;

  @ApiProperty({ description: 'Quantidade produzida', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantidadeProduzida?: number;

  @ApiProperty({ 
    description: 'Status da ordem',
    enum: ['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA', 'PAUSADA'],
    required: false
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ 
    description: 'Prioridade da ordem',
    enum: ['BAIXA', 'MEDIA', 'ALTA', 'URGENTE'],
    required: false
  })
  @IsOptional()
  @IsString()
  prioridade?: string;

  @ApiProperty({ description: 'Data de fim real', required: false })
  @IsOptional()
  @IsDateString()
  dataFimReal?: string;

  @ApiProperty({ description: 'Data de início real', required: false })
  @IsOptional()
  @IsDateString()
  dataInicioReal?: string;

  @ApiProperty({ description: 'Data de início planejada', required: false })
  @IsOptional()
  @IsDateString()
  dataInicioPlanejado?: string;

  @ApiProperty({ description: 'Data de fim planejada', required: false })
  @IsOptional()
  @IsDateString()
  dataFimPlanejado?: string;

  @ApiProperty({ description: 'ID do setor', required: false })
  @IsOptional()
  @IsNumber()
  setorId?: number;

  @ApiProperty({ description: 'ID do responsável', required: false })
  @IsOptional()
  @IsNumber()
  responsavelId?: number;

  @ApiProperty({ 
    description: 'Tipo de origem da ordem de produção',
    enum: ['PEDIDO_VENDA', 'REPOSICAO_ESTOQUE', 'PLANO_MESTRE_PRODUCAO', 'DEMANDA_INTERNA', 'PREVISAO_VENDAS'],
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
