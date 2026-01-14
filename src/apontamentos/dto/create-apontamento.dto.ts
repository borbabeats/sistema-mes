import { ApiProperty } from '@nestjs/swagger';

export class CreateApontamentoDto {
  @ApiProperty({ description: 'ID da máquina' })
  maquinaId: number;

  @ApiProperty({ description: 'ID do operador' })
  opId: number;

  @ApiProperty({ description: 'ID do usuário' })
  usuarioId: number;

  @ApiProperty({ description: 'Data e hora de início do apontamento' })
  dataHoraInicio: Date;

  @ApiProperty({ 
    description: 'Data e hora de fim do apontamento',
    required: false 
  })
  dataHoraFim?: Date;

  @ApiProperty({ 
    description: 'Observações sobre o apontamento',
    required: false 
  })
  observacoes?: string;
}
