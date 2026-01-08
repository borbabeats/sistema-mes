import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateSetorDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nome: string;
}
