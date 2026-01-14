import { ApiProperty } from '@nestjs/swagger';

export class Apontamento {
  @ApiProperty({ description: 'ID do apontamento' })
  id: number;

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

  @ApiProperty({ 
    description: 'Máquina relacionada ao apontamento',
    type: 'number'
  })
  maquinaId: number;

  @ApiProperty({ description: 'Data de criação do registro' })
  createdAt: Date;

  @ApiProperty({ description: 'Data da última atualização do registro' })
  updatedAt: Date;
}