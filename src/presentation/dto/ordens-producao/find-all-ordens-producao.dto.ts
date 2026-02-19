import { IsOptional, IsInt, Min, IsString, IsEnum, IsNumber, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { OrigemOP, PrioridadeOP, StatusOP } from '../../../domain/entities/ordem-producao.entity';

export class FindAllOrdensProducaoDto {
  @ApiPropertyOptional({ description: 'Código da ordem de produção', type: String })
  @IsOptional()
  @IsString()
  codigo?: string;

  @ApiPropertyOptional({ description: 'Produto', type: String })
  @IsOptional()
  @IsString()
  produto?: string;

  @ApiPropertyOptional({ description: 'Status da OP', enum: StatusOP })
  @IsOptional()
  @IsEnum(StatusOP)
  status?: StatusOP;

  @ApiPropertyOptional({ description: 'Prioridade da OP', enum: PrioridadeOP })
  @IsOptional()
  @IsEnum(PrioridadeOP)
  prioridade?: PrioridadeOP;

  @ApiPropertyOptional({ description: 'Tipo de origem da OP', enum: OrigemOP })
  @IsOptional()
  @IsEnum(OrigemOP)
  origemTipo?: OrigemOP;

  @ApiPropertyOptional({ description: 'ID do setor', type: Number })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  setorId?: number;

  @ApiPropertyOptional({ description: 'ID do responsável', type: Number })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  responsavelId?: number;

  @ApiPropertyOptional({ description: 'Data de início (criação) para filtro', type: String })
  @IsOptional()
  @IsDateString()
  dataInicio?: string;

  @ApiPropertyOptional({ description: 'Data de fim (criação) para filtro', type: String })
  @IsOptional()
  @IsDateString()
  dataFim?: string;

  @ApiPropertyOptional({ description: 'Número da página (iniciando em 1)', type: Number, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Quantidade de registros por página', type: Number, default: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Campo para ordenação (ex: createdAt, prioridade, status, codigo)', type: String })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ description: 'Direção da ordenação (ASC ou DESC)', type: String })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({ description: 'Termo de busca geral (legado - compatibilidade)', type: String })
  @IsOptional()
  @IsString()
  filter?: string;

  @ApiPropertyOptional({ description: 'Termo de busca (legado - compatibilidade)', type: String })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Campo específico para busca (legado - compatibilidade)', type: String })
  @IsOptional()
  @IsString()
  searchField?: string;
}
