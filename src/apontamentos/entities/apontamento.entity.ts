import { ApiProperty } from '@nestjs/swagger';

export class Apontamento {
  @ApiProperty({ description: 'ID do apontamento' })
  id: number;

  @ApiProperty({ description: 'ID da ordem de produção relacionada' })
  opId: number;

  @ApiProperty({ description: 'ID da máquina' })
  maquinaId: number;

  @ApiProperty({ description: 'ID do usuário/operador' })
  usuarioId: number;

  @ApiProperty({ 
    description: 'Quantidade produzida no apontamento',
    default: 0 
  })
  quantidadeProduzida: number;

  @ApiProperty({ 
    description: 'Quantidade de defeitos detectados',
    default: 0 
  })
  quantidadeDefeito: number;

  @ApiProperty({ description: 'Data e hora de início do apontamento' })
  dataInicio: Date;

  @ApiProperty({ 
    description: 'Data e hora de fim do apontamento', 
    required: false,
    nullable: true
  })
  dataFim?: Date | null;
}