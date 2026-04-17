import { ApiProperty } from '@nestjs/swagger';

export class TopProdutosDto {
  @ApiProperty({ description: 'Nome do produto', example: 'Peça ABC-123' })
  produto: string;

  @ApiProperty({ description: 'Quantidade produzida', example: 2500 })
  quantidade: number;

  @ApiProperty({ description: 'Percentual de qualidade', example: 98.5 })
  qualidade: number;
}
