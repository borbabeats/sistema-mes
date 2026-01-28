import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateSetorDto {
  @ApiProperty({ description: 'Nome do setor', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  nome?: string;
}
