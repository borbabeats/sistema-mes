import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEmail, IsNumber, MinLength } from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty({ description: 'Nome completo do usuário' })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  nome: string;

  @ApiProperty({ description: 'E-mail do usuário', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Telefone do usuário', required: false })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiProperty({ description: 'Senha do usuário' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  senha: string;

  @ApiProperty({ 
    description: 'Cargo do usuário',
    enum: ['ADMIN', 'GERENTE', 'OPERADOR'],
    default: 'OPERADOR',
    required: false
  })
  @IsOptional()
  @IsString()
  cargo?: string;

  @ApiProperty({ description: 'URL da foto de perfil', required: false })
  @IsOptional()
  @IsString()
  photoProfile?: string;

  @ApiProperty({ description: 'ID do setor', required: false })
  @IsOptional()
  @IsNumber()
  setorId?: number;
}
