import { Injectable, Inject } from '@nestjs/common';
import { IUsuariosRepository } from '../../../domain/repositories/usuarios.repository.interface';
import { Usuario } from '../../../domain/entities/usuario.entity';
import { USUARIOS_REPOSITORY_TOKEN } from '../../../modules/users/constants';

@Injectable()
export class FindUsuarioUseCase {
  constructor(
    @Inject(USUARIOS_REPOSITORY_TOKEN)
    private readonly usuariosRepository: IUsuariosRepository,
  ) {}

  async execute(id: number): Promise<Usuario | null> {
    return this.usuariosRepository.findOne(id);
  }
}
