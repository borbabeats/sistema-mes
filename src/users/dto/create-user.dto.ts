// src/users/dto/create-user.dto.ts
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Cargo } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  senha: string;

  @IsEnum(Cargo)
  @IsNotEmpty()
  cargo: Cargo;

  @IsString()
  @IsOptional()
  telefone?: string;

  @IsString()
  @IsOptional()
  photo_profile?: string;

  @IsOptional()
  setor_id?: number;
}