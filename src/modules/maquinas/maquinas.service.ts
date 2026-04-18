import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMaquinaData } from '../../domain/repositories/maquinas.repository.interface';
import { Maquina } from '../../domain/entities/maquina.entity';
import { MaquinaResponseDto } from '../../presentation/dto/maquinas/maquina-response.dto';
import { CreateMaquinaUseCase } from '../../application/use-cases/maquinas/create-maquina.use-case';
import { FindMaquinaUseCase } from '../../application/use-cases/maquinas/find-maquina.use-case';
import { FindAllMaquinasUseCase } from '../../application/use-cases/maquinas/find-all-maquinas.use-case';
import { UpdateMaquinaUseCase } from '../../application/use-cases/maquinas/update-maquina.use-case';
import { DeleteMaquinaUseCase } from '../../application/use-cases/maquinas/delete-maquina.use-case';
import { UpdateStatusMaquinaUseCase } from '../../application/use-cases/maquinas/update-status-maquina.use-case';
import { UpdateHorasUsoUseCase } from '../../application/use-cases/maquinas/update-horas-uso.use-case';
import { IniciarManutencaoUseCase } from '../../application/use-cases/maquinas/iniciar-manutencao.use-case';
import { FinalizarManutencaoUseCase } from '../../application/use-cases/maquinas/finalizar-manutencao.use-case';
import { FindByCodigoUseCase } from '../../application/use-cases/maquinas/find-by-codigo.use-case';
import { FindBySetorUseCase } from '../../application/use-cases/maquinas/find-by-setor.use-case';
import { FindByStatusUseCase } from '../../application/use-cases/maquinas/find-by-status.use-case';
import { FindAvailableUseCase } from '../../application/use-cases/maquinas/find-available.use-case';

@Injectable()
export class MaquinasService {
  constructor(
    private readonly createMaquinaUseCase: CreateMaquinaUseCase,
    private readonly findMaquinaUseCase: FindMaquinaUseCase,
    private readonly findAllMaquinasUseCase: FindAllMaquinasUseCase,
    private readonly updateMaquinaUseCase: UpdateMaquinaUseCase,
    private readonly deleteMaquinaUseCase: DeleteMaquinaUseCase,
    private readonly updateStatusMaquinaUseCase: UpdateStatusMaquinaUseCase,
    private readonly updateHorasUsoUseCase: UpdateHorasUsoUseCase,
    private readonly iniciarManutencaoUseCase: IniciarManutencaoUseCase,
    private readonly finalizarManutencaoUseCase: FinalizarManutencaoUseCase,
    private readonly findByCodigoUseCase: FindByCodigoUseCase,
    private readonly findBySetorUseCase: FindBySetorUseCase,
    private readonly findByStatusUseCase: FindByStatusUseCase,
    private readonly findAvailableUseCase: FindAvailableUseCase,
  ) {}

  private toMaquinaResponseDto(maquina: Maquina): MaquinaResponseDto {
    const response: MaquinaResponseDto = {
      id: maquina.id,
      codigo: maquina.codigo,
      nome: maquina.nome,
      descricao: maquina.descricao,
      fabricante: maquina.fabricante,
      modelo: maquina.modelo,
      numeroSerie: maquina.numeroSerie,
      anoFabricacao: maquina.anoFabricacao,
      capacidade: maquina.capacidade,
      status: maquina.status,
      horasUso: maquina.horasUso,
      setorId: maquina.setorId,
      createdAt: maquina.createdAt,
      updatedAt: maquina.updatedAt,
      deletedAt: maquina.deletedAt,
    };

    // Adicionar dados do setor se existirem
    if ((maquina as any).setor) {
      response.setor = (maquina as any).setor;
    }

    return response;
  }

  async create(
    createMaquinaDto: CreateMaquinaData,
  ): Promise<MaquinaResponseDto> {
    const maquina = await this.createMaquinaUseCase.execute(createMaquinaDto);
    return this.toMaquinaResponseDto(maquina);
  }

  async findAll(filters?: any): Promise<MaquinaResponseDto[]> {
    const maquinas = await this.findAllMaquinasUseCase.execute(filters);
    return maquinas.map((maquina) => this.toMaquinaResponseDto(maquina));
  }

  async findOne(id: number): Promise<MaquinaResponseDto> {
    const maquina = await this.findMaquinaUseCase.execute(id);

    if (!maquina) {
      throw new NotFoundException(`Máquina com ID ${id} não encontrada`);
    }

    return this.toMaquinaResponseDto(maquina);
  }

  async findByCodigo(codigo: string): Promise<MaquinaResponseDto | null> {
    const maquina = await this.findByCodigoUseCase.execute(codigo);
    return maquina ? this.toMaquinaResponseDto(maquina) : null;
  }

  async findBySetor(setorId: number): Promise<MaquinaResponseDto[]> {
    const maquinas = await this.findBySetorUseCase.execute(setorId);
    return maquinas.map((maquina) => this.toMaquinaResponseDto(maquina));
  }

  async findByStatus(status: any): Promise<MaquinaResponseDto[]> {
    const maquinas = await this.findByStatusUseCase.execute(status);
    return maquinas.map((maquina) => this.toMaquinaResponseDto(maquina));
  }

  async findAvailable(): Promise<MaquinaResponseDto[]> {
    const maquinas = await this.findAvailableUseCase.execute();
    return maquinas.map((maquina) => this.toMaquinaResponseDto(maquina));
  }

  async update(id: number, updateMaquinaDto: any): Promise<MaquinaResponseDto> {
    const maquina = await this.updateMaquinaUseCase.execute(
      id,
      updateMaquinaDto,
    );
    return this.toMaquinaResponseDto(maquina);
  }

  async remove(
    id: number,
  ): Promise<{ message: string; id: number; codigo: string }> {
    return this.deleteMaquinaUseCase.execute(id);
  }

  async updateHorasUso(
    id: number,
    horasAdicionais: number,
  ): Promise<MaquinaResponseDto> {
    const maquina = await this.updateHorasUsoUseCase.execute(
      id,
      horasAdicionais,
    );
    return this.toMaquinaResponseDto(maquina);
  }

  // Métodos de manutenção usando os novos use cases
  async iniciarManutencao(
    id: number,
    manutencaoData: any,
  ): Promise<{ maquina: MaquinaResponseDto; manutencao: any }> {
    const result = await this.iniciarManutencaoUseCase.execute(
      id,
      manutencaoData,
    );
    return {
      maquina: this.toMaquinaResponseDto(result.maquina),
      manutencao: result.manutencao,
    };
  }

  async finalizarManutencao(
    id: number,
    manutencaoData: any,
  ): Promise<{ maquina: MaquinaResponseDto; manutencao: any }> {
    const result = await this.finalizarManutencaoUseCase.execute(
      id,
      manutencaoData,
    );
    return {
      maquina: this.toMaquinaResponseDto(result.maquina),
      manutencao: result.manutencao,
    };
  }

  async updateStatus(
    id: number,
    status: any,
    motivo?: string,
  ): Promise<MaquinaResponseDto> {
    const maquina = await this.updateStatusMaquinaUseCase.execute(
      id,
      status,
      motivo,
    );
    return this.toMaquinaResponseDto(maquina);
  }
}
