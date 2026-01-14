import { ApiProperty } from '@nestjs/swagger';
import { Manutencao } from './manutencao.entity';

export class HistoricoManutencao {
  @ApiProperty({ description: 'ID do registro de histórico' })
  id: number;

  @ApiProperty({ 
    description: 'Manutenção relacionada',
    type: () => Manutencao 
  })
  manutencao: Manutencao;

  @ApiProperty({ description: 'ID da manutenção' })
  manutencaoId: number;

  @ApiProperty({ 
    description: 'Status anterior da manutenção',
    required: false 
  })
  statusAnterior?: string;

  @ApiProperty({ 
    description: 'Novo status da manutenção' 
  })
  statusNovo: string;

  @ApiProperty({ 
    description: 'Descrição detalhada da alteração' 
  })
  descricao: string;

  @ApiProperty({ 
    description: 'Data e hora do registro do histórico',
    type: Date 
  })
  dataRegistro: Date;
}
