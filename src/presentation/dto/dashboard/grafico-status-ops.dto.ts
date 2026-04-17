import { ApiProperty } from '@nestjs/swagger';

export class GraficoStatusOpsDto {
  @ApiProperty({ description: 'Status da OP', example: 'EM_ANDAMENTO' })
  status: string;

  @ApiProperty({ description: 'Quantidade de OPs', example: 15 })
  quantidade: number;
}
