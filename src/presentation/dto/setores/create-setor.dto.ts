import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateSetorDto {
  @ApiProperty({ description: 'Nome do setor' })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  nome: string;
}
