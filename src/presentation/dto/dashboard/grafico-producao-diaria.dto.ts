import { ApiProperty } from '@nestjs/swagger';

export class GraficoProducaoDiariaDto {
  @ApiProperty({ description: 'Data da produção', example: '2024-01-15' })
  data: string;

  @ApiProperty({ description: 'Quantidade produzida', example: 1250 })
  produzido: number;

  @ApiProperty({ description: 'Quantidade planejada', example: 1400 })
  planejado: number;
}
