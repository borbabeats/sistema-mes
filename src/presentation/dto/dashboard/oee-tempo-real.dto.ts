import { ApiProperty } from '@nestjs/swagger';

export class OeeTempoRealDto {
  @ApiProperty({ description: 'Valor do OEE em percentual', example: 78.5 })
  valor: number;

  @ApiProperty({ description: 'Status do OEE', example: 'REGULAR', enum: ['CRITICO', 'REGULAR', 'OTIMO'] })
  status: string;

  @ApiProperty({ description: 'Meta de OEE', example: 85 })
  meta: number;
}
