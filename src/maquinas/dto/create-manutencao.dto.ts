import { ApiProperty } from '@nestjs/swagger';
import { 
  IsNumber, 
  IsNotEmpty, 
  IsString, 
  IsOptional, 
  IsEnum, 
  IsDateString,
  IsPositive,
  IsBoolean
} from 'class-validator';
import { TipoManutencao, StatusManutencao } from '../entities/manutencao.entity';

export class CreateManutencaoDto {
  @ApiProperty({ description: 'ID da máquina que será submetida à manutenção' })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  maquinaId: number;

  @ApiProperty({ 
    description: 'Tipo de manutenção',
    enum: TipoManutencao 
  })
  @IsEnum(TipoManutencao)
  @IsNotEmpty()
  tipo: TipoManutencao;

  @ApiProperty({ description: 'Descrição detalhada da manutenção' })
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @ApiProperty({ 
    description: 'Data e hora agendada para a manutenção',
    type: String, 
    format: 'date-time' 
  })
  @IsDateString()
  @IsNotEmpty()
  dataAgendada: Date;

  @ApiProperty({ 
    description: 'Data e hora de início real da manutenção',
    type: String,
    format: 'date-time',
    required: false 
  })
  @IsDateString()
  @IsOptional()
  dataInicio?: Date;

  @ApiProperty({ 
    description: 'Data e hora de conclusão da manutenção',
    type: String,
    format: 'date-time',
    required: false 
  })
  @IsDateString()
  @IsOptional()
  dataFim?: Date;

  @ApiProperty({ 
    description: 'Status atual da manutenção',
    enum: StatusManutencao,
    default: StatusManutencao.AGENDADA 
  })
  @IsEnum(StatusManutencao)
  @IsOptional()
  status?: StatusManutencao;

  @ApiProperty({ 
    description: 'Custo estimado da manutenção',
    type: Number,
    required: false 
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  custoEstimado?: number;

  @ApiProperty({ 
    description: 'ID do responsável pela manutenção',
    required: false 
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  responsavelId?: number;

  @ApiProperty({ 
    description: 'Observações adicionais sobre a manutenção',
    required: false 
  })
  @IsString()
  @IsOptional()
  observacoes?: string;
}
