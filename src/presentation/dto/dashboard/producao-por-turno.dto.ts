import { ApiProperty } from '@nestjs/swagger';

export class ProducaoPorTurnoDto {
  @ApiProperty({ description: 'Data da produção', example: '2024-01-15' })
  data: string;

  @ApiProperty({ description: 'Turno de produção', example: 'Manhã' })
  turno: string;

  @ApiProperty({ description: 'Quantidade produzida', example: 450 })
  quantidade: number;
}
