import { FilterApontamentosDto } from './filter-apontamentos.dto';
import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class FindAllApontamentosDto extends FilterApontamentosDto {
  @ApiPropertyOptional({
    description: 'Número da página (iniciando em 1)',
    type: Number,
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Quantidade de registros por página',
    type: Number,
    default: 20,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Campo para ordenação (ex: dataInicio, quantidadeProduzida, op.codigo, maquina.nome)',
    type: String,
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Direção da ordenação (ASC ou DESC)',
    type: String,
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({
    description: 'Termo de busca geral (busca em código da OP, nome da máquina, nome do usuário, produto)',
    type: String,
  })
  @IsOptional()
  @IsString()
  filter?: string;

  @ApiPropertyOptional({
    description: 'Termo de busca (legado - mantido para compatibilidade)',
    type: String,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Campo específico para busca (legado - mantido para compatibilidade)',
    type: String,
  })
  @IsOptional()
  @IsString()
  searchField?: string;
}
