import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsDate } from 'class-validator';

export class FinalizarManutencaoDto {
  @ApiProperty({ 
    description: 'Resultado da manutenção realizada' 
  })
  @IsString()
  resultado: string;

  @ApiPropertyOptional({ 
    description: 'Custo real da manutenção',
    type: Number 
  })
  @IsOptional()
  @IsNumber()
  custoReal?: number;

  @ApiPropertyOptional({ 
    description: 'Observações finais sobre a manutenção' 
  })
  @IsOptional()
  @IsString()
  observacoes?: string;

  @ApiPropertyOptional({ 
    description: 'Data para próxima manutenção',
    type: Date 
  })
  @IsOptional()
  @IsDate()
  proximaManutencao?: Date;
}
