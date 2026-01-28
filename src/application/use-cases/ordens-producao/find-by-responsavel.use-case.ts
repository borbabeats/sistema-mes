import { Injectable, Inject } from '@nestjs/common';
import { IOrdensProducaoRepository } from '../../../domain/repositories/ordens-producao.repository.interface';
import { OrdemProducao } from '../../../domain/entities/ordem-producao.entity';
import { ORDENS_PRODUCAO_REPOSITORY_TOKEN } from '../../../modules/ordens-producao/constants';
import { FindUsuarioUseCase } from '../usuarios/find-usuario.use-case';

@Injectable()
export class FindByResponsavelUseCase {
  constructor(
    @Inject(ORDENS_PRODUCAO_REPOSITORY_TOKEN) private readonly ordensProducaoRepository: IOrdensProducaoRepository,
    private readonly findUsuarioUseCase: FindUsuarioUseCase,
  ) {}

  async execute(responsavelId: number): Promise<OrdemProducao[]> {
    // Validar se o responsável existe
    const responsavel = await this.findUsuarioUseCase.execute(responsavelId);
    if (!responsavel) {
      throw new Error('Responsável não encontrado');
    }

    return this.ordensProducaoRepository.findByResponsavel(responsavelId);
  }
}
