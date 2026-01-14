import { ApiProperty } from '@nestjs/swagger';
import { Maquina } from './maquina.entity';
import { Usuario } from '../../auth/entities/usuario.entity';
import { HistoricoManutencao } from './historico-manutencao.entity';

export enum TipoManutencao {
  PREVENTIVA = 'PREVENTIVA',
  CORRETIVA = 'CORRETIVA',
  PREDITIVA = 'PREDITIVA',
  LUBRIFICACAO = 'LUBRIFICACAO',
  CALIBRACAO = 'CALIBRACAO',
  OUTRA = 'OUTRA',
}

export enum StatusManutencao {
  AGENDADA = 'AGENDADA',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDA = 'CONCLUIDA',
  CANCELADA = 'CANCELADA',
  ATRASADA = 'ATRASADA',
}

export class Manutencao {
  @ApiProperty({ description: 'ID da manutenção' })
  id: number;

  @ApiProperty({ 
    description: 'Máquina que será submetida à manutenção',
    type: () => Maquina 
  })
  maquina: Maquina;

  @ApiProperty({ description: 'ID da máquina' })
  maquinaId: number;

  @ApiProperty({ 
    description: 'Tipo de manutenção',
    enum: TipoManutencao 
  })
  tipo: TipoManutencao;

  @ApiProperty({ description: 'Descrição detalhada da manutenção' })
  descricao: string;

  @ApiProperty({ 
    description: 'Data e hora agendada para a manutenção',
    type: Date 
  })
  dataAgendada: Date;

  @ApiProperty({ 
    description: 'Data e hora de início real da manutenção',
    type: Date,
    required: false 
  })
  dataInicio?: Date;

  @ApiProperty({ 
    description: 'Data e hora de conclusão da manutenção',
    type: Date,
    required: false 
  })
  dataFim?: Date;

  @ApiProperty({ 
    description: 'Status atual da manutenção',
    enum: StatusManutencao,
    default: StatusManutencao.AGENDADA 
  })
  status: StatusManutencao;

  @ApiProperty({ 
    description: 'Custo estimado da manutenção',
    type: Number,
    required: false 
  })
  custoEstimado?: number;

  @ApiProperty({ 
    description: 'Custo real da manutenção',
    type: Number,
    required: false 
  })
  custoReal?: number;

  @ApiProperty({ 
    description: 'Responsável pela manutenção',
    type: () => Usuario,
    required: false 
  })
  responsavel?: Usuario;

  @ApiProperty({ 
    description: 'ID do responsável pela manutenção',
    required: false 
  })
  responsavelId?: number;

  @ApiProperty({ 
    description: 'Observações adicionais sobre a manutenção',
    required: false 
  })
  observacoes?: string;

  @ApiProperty({ 
    description: 'Data de criação do registro',
    type: Date 
  })
  createdAt: Date;

  @ApiProperty({ 
    description: 'Data da última atualização do registro',
    type: Date 
  })
  updatedAt: Date;

  // Relacionamentos
  @ApiProperty({ 
    description: 'Histórico de alterações da manutenção',
    type: () => [HistoricoManutencao],
    required: false 
  })
  historico?: HistoricoManutencao[];
}
