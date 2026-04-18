import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min } from 'class-validator';

export class FinalizeApontamentoDto {
  @ApiProperty({
    description: 'Quantidade produzida final',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantidadeProduzida?: number;

  @ApiProperty({
    description: 'Quantidade de defeitos final',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantidadeDefeito?: number;
}
