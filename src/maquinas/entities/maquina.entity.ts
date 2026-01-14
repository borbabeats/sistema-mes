import { ApiProperty } from '@nestjs/swagger';
import { Setor } from '../../setores/entities/setor.entity';
import { Apontamento } from '../../apontamentos/entities/apontamento.entity';
import { Manutencao } from './manutencao.entity';

export enum StatusMaquina {
  DISPONIVEL = 'DISPONIVEL',
  EM_USO = 'EM_USO',
  MANUTENCAO = 'MANUTENCAO',
  INATIVA = 'INATIVA',
  PARADA = 'PARADA',
  DESATIVADA = 'DESATIVADA',
}

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

export class Maquina {
  @ApiProperty({ description: 'ID da máquina' })
  id: number;

  @ApiProperty({ description: 'Código único da máquina' })
  codigo: string;

  @ApiProperty({ description: 'Nome da máquina' })
  nome: string;

  @ApiProperty({ description: 'Descrição detalhada da máquina', required: false })
  descricao?: string;

  @ApiProperty({ description: 'Fabricante da máquina', required: false })
  fabricante?: string;

  @ApiProperty({ description: 'Modelo da máquina', required: false })
  modelo?: string;

  @ApiProperty({ description: 'Número de série da máquina', required: false })
  numeroSerie?: string;

  @ApiProperty({ description: 'Ano de fabricação da máquina', required: false })
  anoFabricacao?: number;

  @ApiProperty({ description: 'Capacidade da máquina', required: false })
  capacidade?: string;

  @ApiProperty({ 
    description: 'Status atual da máquina',
    enum: StatusMaquina,
    default: StatusMaquina.DISPONIVEL 
  })
  status: StatusMaquina;

  @ApiProperty({ 
    description: 'Total de horas de uso da máquina',
    default: 0 
  })
  horasUso: number;

  @ApiProperty({ 
    description: 'Setor ao qual a máquina pertence',
    type: () => Setor,
    required: false 
  })
  setor?: Setor;

  @ApiProperty({ 
    description: 'ID do setor',
    required: false 
  })
  setorId?: number;

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

  @ApiProperty({ 
    description: 'Data de remoção do registro (soft delete)',
    type: Date,
    required: false 
  })
  deletedAt?: Date;

  // Relacionamentos
  @ApiProperty({ 
    description: 'Lista de apontamentos da máquina',
    type: () => [Apontamento],
    required: false 
  })
  apontamentos?: Apontamento[];

  @ApiProperty({ 
    description: 'Lista de manutenções da máquina',
    type: () => [Manutencao],
    required: false 
  })
  manutencoes?: Manutencao[];
}
