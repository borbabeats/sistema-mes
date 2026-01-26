import { OrdemProducao } from '../entities/ordem-producao-entity';
import { CreateOrdemProducaoDto } from '../dto/create-ordem-producao.dto';
import { UpdateOrdemProducaoDto } from '../dto/update-ordem-producao.dto';
import { FilterOrdemProducaoDto } from '../dto/filter-ordem-producao.dto';

export abstract class IOrdensProducaoRepository {
  abstract create(data: CreateOrdemProducaoDto): Promise<OrdemProducao>;
  abstract findAll(filters?: FilterOrdemProducaoDto): Promise<OrdemProducao[]>;
  abstract findOne(id: number): Promise<OrdemProducao | null>;
  abstract update(id: number, data: UpdateOrdemProducaoDto): Promise<OrdemProducao>;
  abstract remove(id: number): Promise<OrdemProducao>;
  abstract iniciarProducao(id: number): Promise<OrdemProducao>;
  abstract pausarProducao(id: number): Promise<OrdemProducao>;
  abstract retomarProducao(id: number): Promise<OrdemProducao>;
  abstract finalizarProducao(id: number): Promise<OrdemProducao>;
  abstract cancelarProducao(id: number, motivo: string): Promise<OrdemProducao>;
  abstract atualizarProducao(id: number, quantidadeProduzida: number, quantidadeDefeito?: number): Promise<OrdemProducao>;
}
