import { ApiProperty } from '@nestjs/swagger';
import { StatusMaquina } from '../../../domain/entities/maquina.entity';

export class MaquinaResponseDto {
  @ApiProperty({ description: 'ID da máquina' })
  id: number;

  @ApiProperty({ description: 'Código da máquina' })
  codigo: string;

  @ApiProperty({ description: 'Nome da máquina' })
  nome: string;

  @ApiProperty({ description: 'Descrição da máquina' })
  descricao?: string;

  @ApiProperty({ description: 'Fabricante da máquina' })
  fabricante?: string;

  @ApiProperty({ description: 'Modelo da máquina' })
  modelo?: string;

  @ApiProperty({ description: 'Número de série' })
  numeroSerie?: string;

  @ApiProperty({ description: 'Ano de fabricação' })
  anoFabricacao?: number;

  @ApiProperty({ description: 'Capacidade da máquina' })
  capacidade?: string;

  @ApiProperty({ 
    description: 'Status da máquina',
    enum: ['DISPONIVEL', 'EM_USO', 'MANUTENCAO', 'INATIVA', 'PARADA', 'DESATIVADA']
  })
  status: StatusMaquina;

  @ApiProperty({ description: 'Horas de uso' })
  horasUso: number;

  @ApiProperty({ description: 'ID do setor' })
  setorId?: number;

  @ApiProperty({ description: 'Dados do setor' })
  setor?: {
    id: number;
    nome: string;
  };

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização' })
  updatedAt: Date;

  @ApiProperty({ description: 'Data de exclusão (soft delete)' })
  deletedAt?: Date;
}
