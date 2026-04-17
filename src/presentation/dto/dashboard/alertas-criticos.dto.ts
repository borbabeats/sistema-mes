import { ApiProperty } from '@nestjs/swagger';

export class AlertasCriticosDto {
  @ApiProperty({ description: 'Número de máquinas paradas', example: 2 })
  maquinasParadas: number;

  @ApiProperty({ description: 'Número de OPs atrasadas', example: 5 })
  opsAtrasadas: number;

  @ApiProperty({ description: 'Indica se taxa de defeitos está alta', example: true })
  taxaDefeitosAlta: boolean;

  @ApiProperty({ description: 'Taxa de defeitos atual em percentual', example: 6.2 })
  taxaDefeitos: number;
}
