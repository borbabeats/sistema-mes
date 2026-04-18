import { ApiProperty } from '@nestjs/swagger';

export class KpisProducaoDto {
  @ApiProperty({
    description: 'Total de ordens de produção em andamento',
    example: 25,
  })
  opsAtivas: number;

  @ApiProperty({
    description: 'Quantidade produzida nas últimas 24h',
    example: 1250,
  })
  producaoDia: number;

  @ApiProperty({
    description: 'Eficiência global em percentual',
    example: 87.5,
  })
  eficienciaGlobal: number;

  @ApiProperty({ description: 'Taxa de defeitos em percentual', example: 2.3 })
  taxaDefeitos: number;
}
