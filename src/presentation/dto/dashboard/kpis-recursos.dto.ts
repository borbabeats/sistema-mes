import { ApiProperty } from '@nestjs/swagger';

export class KpisRecursosDto {
  @ApiProperty({ description: 'Número de máquinas em operação', example: 18 })
  maquinasAtivas: number;

  @ApiProperty({ description: 'Overall Equipment Effectiveness em percentual', example: 78.5 })
  taxaOEE: number;

  @ApiProperty({ description: 'Percentual de tempo disponível vs tempo planejado', example: 85.2 })
  disponibilidade: number;
}
