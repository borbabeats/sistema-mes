import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { StatusOP } from '../../../domain/entities/ordem-producao.entity';

export class ChangeStatusOrdemProducaoDto {
  @ApiProperty({
    description: 'Novo status da ordem de produção',
    enum: StatusOP,
  })
  @IsEnum(StatusOP)
  @IsNotEmpty()
  novoStatus: StatusOP;

  @ApiProperty({ description: 'Motivo da mudança de status', required: false })
  @IsOptional()
  @IsString()
  motivo?: string;
}
