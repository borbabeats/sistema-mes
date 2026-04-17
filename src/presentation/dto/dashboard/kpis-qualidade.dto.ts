import { ApiProperty } from '@nestjs/swagger';

export class KpisQualidadeDto {
  @ApiProperty({ description: 'Percentual de produção sem defeitos', example: 97.7 })
  indiceQualidade: number;

  @ApiProperty({ description: 'Total de peças rejeitadas no mês', example: 45 })
  rejeicoesMes: number;

  @ApiProperty({ description: 'Percentual de OPs concluídas dentro dos padrões', example: 92.3 })
  conformidade: number;
}
