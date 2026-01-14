import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsDateString } from 'class-validator';
import { StatusMaquina } from '../entities/maquina.entity';

export class CreateMaquinaDto {
  @ApiProperty({ description: 'Código único da máquina' })
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @ApiProperty({ description: 'Nome da máquina' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ description: 'Descrição detalhada da máquina', required: false })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiProperty({ description: 'Fabricante da máquina', required: false })
  @IsString()
  @IsOptional()
  fabricante?: string;

  @ApiProperty({ description: 'Modelo da máquina', required: false })
  @IsString()
  @IsOptional()
  modelo?: string;

  @ApiProperty({ description: 'Número de série da máquina', required: false })
  @IsString()
  @IsOptional()
  numeroSerie?: string;

  @ApiProperty({ description: 'Ano de fabricação da máquina', required: false })
  @IsNumber()
  @IsOptional()
  anoFabricacao?: number;

  @ApiProperty({ description: 'Capacidade da máquina', required: false })
  @IsString()
  @IsOptional()
  capacidade?: string;

  @ApiProperty({ 
    description: 'Status atual da máquina',
    enum: StatusMaquina,
    default: StatusMaquina.DISPONIVEL 
  })
  @IsEnum(StatusMaquina)
  @IsOptional()
  status?: StatusMaquina;

  @ApiProperty({ 
    description: 'ID do setor ao qual a máquina pertence',
    required: false 
  })
  @IsNumber()
  @IsOptional()
  setorId?: number;
}
