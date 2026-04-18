import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsDate,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TipoManutencao } from '../../../domain/entities/manutencao.entity';

export class IniciarManutencaoDto {
  @ApiProperty({
    description: 'Tipo da manutenção',
    enum: TipoManutencao,
  })
  @IsEnum(TipoManutencao)
  tipo: TipoManutencao;

  @ApiProperty({
    description: 'Descrição detalhada da manutenção',
  })
  @IsString()
  descricao: string;

  @ApiPropertyOptional({
    description: 'Data agendada para a manutenção',
    type: Date,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dataAgendada?: Date;

  @ApiPropertyOptional({
    description: 'Previsão de término da manutenção',
    type: Date,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  previsaoTermino?: Date;

  @ApiPropertyOptional({
    description: 'ID do responsável pela manutenção',
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  responsavelId?: number;

  @ApiPropertyOptional({
    description: 'Custo estimado da manutenção',
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  custoEstimado?: number;

  @ApiPropertyOptional({
    description: 'Observações adicionais',
  })
  @IsOptional()
  @IsString()
  observacoes?: string;
}
