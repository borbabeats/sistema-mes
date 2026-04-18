import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEmail,
  IsNumber,
  MinLength,
} from 'class-validator';

export class UpdateUsuarioDto {
  @ApiProperty({ description: 'Nome completo do usuário', required: false })
  @IsOptional()
  @IsString()
  @MinLength(3)
  nome?: string;

  @ApiProperty({ description: 'E-mail do usuário', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Telefone do usuário', required: false })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiProperty({ description: 'Senha do usuário', required: false })
  @IsOptional()
  @IsString()
  @MinLength(6)
  senha?: string;

  @ApiProperty({
    description: 'Cargo do usuário',
    enum: ['ADMIN', 'GERENTE', 'OPERADOR'],
    required: false,
  })
  @IsOptional()
  @IsString()
  cargo?: string;

  @ApiProperty({ description: 'Turno de trabalho', required: false })
  @IsOptional()
  @IsString()
  turno?: string;

  @ApiProperty({ description: 'URL da foto de perfil', required: false })
  @IsOptional()
  @IsString()
  photoProfile?: string;

  @ApiProperty({ description: 'ID do setor', required: false })
  @IsOptional()
  @IsNumber()
  setorId?: number;
}
