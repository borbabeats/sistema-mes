import { ApiProperty } from '@nestjs/swagger';

export class EficienciaOperadoresDto {
  @ApiProperty({ description: 'Posição no ranking', example: 1 })
  posicao: number;

  @ApiProperty({ description: 'Nome do operador', example: 'João Silva' })
  nome: string;

  @ApiProperty({ description: 'Cargo do operador', example: 'OPERADOR' })
  cargo: string;

  @ApiProperty({ description: 'Total de apontamentos no período', example: 45 })
  totalApontamentos: number;

  @ApiProperty({ description: 'Total produzido no período', example: 3500 })
  totalProduzido: number;

  @ApiProperty({ description: 'Média de produção por apontamento', example: 77.8 })
  mediaProducao: number;

  @ApiProperty({ description: 'Taxa de qualidade em percentual', example: 98.5 })
  taxaQualidade: number;
}
