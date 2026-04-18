import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { StatusMaquina } from '../../../domain/entities/maquina.entity';

export class CreateMaquinaDto {
  @ApiProperty({ description: 'Código único da máquina' })
  @IsNotEmpty()
  @IsString()
  codigo: string;

  @ApiProperty({ description: 'Nome da máquina' })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiProperty({
    description: 'Descrição detalhada da máquina',
    required: false,
  })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({ description: 'Fabricante da máquina', required: false })
  @IsOptional()
  @IsString()
  fabricante?: string;

  @ApiProperty({ description: 'Modelo da máquina', required: false })
  @IsOptional()
  @IsString()
  modelo?: string;

  @ApiProperty({ description: 'Número de série da máquina', required: false })
  @IsOptional()
  @IsString()
  numeroSerie?: string;

  @ApiProperty({ description: 'Ano de fabricação da máquina', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear())
  anoFabricacao?: number;

  @ApiProperty({ description: 'Capacidade da máquina', required: false })
  @IsOptional()
  @IsString()
  capacidade?: string;

  @ApiProperty({
    description: 'Status inicial da máquina',
    enum: StatusMaquina,
    default: StatusMaquina.DISPONIVEL,
    required: false,
  })
  @IsOptional()
  @IsEnum(StatusMaquina)
  status?: StatusMaquina;

  @ApiProperty({ description: 'ID do setor', required: false })
  @IsOptional()
  @IsNumber()
  setorId?: number;
}
