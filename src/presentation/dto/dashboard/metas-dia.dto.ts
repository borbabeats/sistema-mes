import { ApiProperty } from '@nestjs/swagger';

export class MetasDiaDto {
  @ApiProperty({ description: 'Meta de produção do dia', example: 1000 })
  meta: number;

  @ApiProperty({ description: 'Quantidade já produzida', example: 750 })
  produzido: number;

  @ApiProperty({ description: 'Percentual de progresso', example: 75.0 })
  progresso: number;

  @ApiProperty({ description: 'Quantidade faltante para atingir a meta', example: 250 })
  faltante: number;
}
