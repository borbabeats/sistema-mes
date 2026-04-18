import { Injectable, Inject } from '@nestjs/common';
import {
  IApontamentosRepository,
  APONTAMENTOS_REPOSITORY_TOKEN,
} from '../../../domain/repositories/apontamentos.repository.interface';
import { Apontamento } from '../../../domain/entities/apontamento.entity';
import { FindUsuarioUseCase } from '../usuarios/find-usuario.use-case';

@Injectable()
export class FindByUsuarioUseCase {
  constructor(
    @Inject(APONTAMENTOS_REPOSITORY_TOKEN)
    private readonly apontamentosRepository: IApontamentosRepository,
    private readonly findUsuarioUseCase: FindUsuarioUseCase,
  ) {}

  async execute(usuarioId: number): Promise<Apontamento[]> {
    // Validar se o usuário existe
    const usuario = await this.findUsuarioUseCase.execute(usuarioId);
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    return this.apontamentosRepository.findByUsuario(usuarioId);
  }
}
