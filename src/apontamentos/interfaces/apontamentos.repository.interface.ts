import { Apontamento } from '../entities/apontamento.entity';
import { CreateApontamentoDto } from '../dto/create-apontamento.dto';
import { UpdateApontamentoDto } from '../dto/update-apontamento.dto';

export abstract class IApontamentosRepository {
  abstract create(data: CreateApontamentoDto): Promise<Apontamento>;
  abstract findAll(filters?: any): Promise<Apontamento[]>;
  abstract findOne(id: number): Promise<Apontamento | null>;
  abstract findByMaquina(maquinaId: number): Promise<Apontamento[]>;
  abstract findByUsuario(usuarioId: number): Promise<Apontamento[]>;
  abstract findByOrdemProducao(opId: number): Promise<Apontamento[]>;
  abstract findByPeriodo(dataInicio: Date, dataFim: Date): Promise<Apontamento[]>;
  abstract update(id: number, data: UpdateApontamentoDto): Promise<Apontamento>;
  abstract remove(id: number): Promise<Apontamento>;
}
