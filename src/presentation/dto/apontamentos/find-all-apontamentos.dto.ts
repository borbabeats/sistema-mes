import { FilterApontamentosDto } from './filter-apontamentos.dto';
import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class FindAllApontamentosDto extends FilterApontamentosDto {
  @ApiPropertyOptional({
    description: 'Posição inicial (Refine pattern)',
    type: Number,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => parseInt(value))
  _start?: number = 0;

  @ApiPropertyOptional({
    description: 'Posição final (Refine pattern)',
    type: Number,
    default: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => parseInt(value))
  _end?: number = 10;

  @ApiPropertyOptional({
    description: 'Termo de busca',
    type: String,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Campo específico para busca',
    type: String,
  })
  @IsOptional()
  @IsString()
  searchField?: string;
}
