import { ApiProperty } from '@nestjs/swagger';

export class ComparativoTurnoItemDto {
  @ApiProperty({ description: 'Turno de produção', example: 'Manhã' })
  turno: string;

  @ApiProperty({ description: 'Quantidade produzida no turno', example: 1250 })
  quantidade: number;
}
