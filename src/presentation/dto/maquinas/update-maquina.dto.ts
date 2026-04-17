import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { CreateMaquinaDto } from './create-maquina.dto';

export class UpdateMaquinaDto {
  @ApiProperty({ description: 'Código único da máquina', required: false })
  @IsOptional()
  @IsString()
  codigo?: string;

  @ApiProperty({ description: 'Nome da máquina', required: false })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiProperty({ description: 'Descrição detalhada da máquina', required: false })
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
    description: 'Status da máquina',
    enum: ['DISPONIVEL', 'EM_USO', 'MANUTENCAO', 'INATIVA', 'PARADA', 'DESATIVADA'],
    required: false
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: 'ID do setor', required: false })
  @IsOptional()
  @IsNumber()
  setorId?: number;
}
