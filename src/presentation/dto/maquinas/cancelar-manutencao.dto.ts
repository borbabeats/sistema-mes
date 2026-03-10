import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CancelarManutencaoDto {
  @ApiProperty({ 
    description: 'Motivo do cancelamento da manutenção' 
  })
  @IsString()
  motivo: string;

  @ApiProperty({ 
    description: 'Observações adicionais sobre o cancelamento' 
  })
  @IsString()
  observacoes?: string;
}
