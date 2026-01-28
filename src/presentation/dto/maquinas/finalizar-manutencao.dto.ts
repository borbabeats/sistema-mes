import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDate, IsNotEmpty } from 'class-validator';

export class FinalizarManutencaoDto {
  @ApiProperty({
    description: 'Resultado da manutenção',
    example: 'Manutenção concluída com sucesso. Peças trocadas: filtro de óleo e correias.',
  })
  @IsNotEmpty()
  @IsString()
  resultado: string;

  @ApiProperty({
    description: 'Observações adicionais sobre a manutenção',
    example: 'Recomendar próxima troca em 6 meses',
    required: false,
  })
  @IsOptional()
  @IsString()
  observacoes?: string;

  @ApiProperty({
    description: 'Previsão da próxima manutenção',
    example: '2024-08-01T10:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  proximaManutencao?: Date;
}
