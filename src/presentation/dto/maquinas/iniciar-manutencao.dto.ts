import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDate, IsNotEmpty } from 'class-validator';
import { TipoManutencao } from '../../../domain/entities/maquina.entity';

export class IniciarManutencaoDto {
  @ApiProperty({
    description: 'Tipo da manutenção',
    enum: TipoManutencao,
    example: TipoManutencao.PREVENTIVA,
  })
  @IsNotEmpty()
  @IsString()
  tipo: TipoManutencao;

  @ApiProperty({
    description: 'Descrição da manutenção',
    example: 'Manutenção preventiva mensal da máquina',
  })
  @IsNotEmpty()
  @IsString()
  descricao: string;

  @ApiProperty({
    description: 'Previsão de término da manutenção',
    example: '2024-02-01T18:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  previsaoTermino?: Date;

  @ApiProperty({
    description: 'Responsável pela manutenção',
    example: 'João Silva',
    required: false,
  })
  @IsOptional()
  @IsString()
  responsavel?: string;
}
