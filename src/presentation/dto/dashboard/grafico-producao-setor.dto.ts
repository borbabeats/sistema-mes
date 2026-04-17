import { ApiProperty } from '@nestjs/swagger';

export class GraficoProducaoSetorDto {
  @ApiProperty({ description: 'Nome do setor', example: 'Injeção' })
  setor: string;

  @ApiProperty({ description: 'Quantidade produzida', example: 3500 })
  produzido: number;
}
