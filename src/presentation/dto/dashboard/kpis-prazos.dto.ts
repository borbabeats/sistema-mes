import { ApiProperty } from '@nestjs/swagger';

export class KpisPrazosDto {
  @ApiProperty({ description: 'Quantidade de ordens fora do prazo', example: 5 })
  opsAtraso: number;

  @ApiProperty({ description: 'Percentual de entregas no prazo', example: 88.5 })
  cumprimentoPrazos: number;

  @ApiProperty({ description: 'Duração média das OPs em horas', example: 12.5 })
  tempoMedioCiclo: number;
}
