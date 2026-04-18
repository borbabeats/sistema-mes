import { Injectable, Inject } from '@nestjs/common';
import { IUsuariosRepository } from '../../../domain/repositories/usuarios.repository.interface';
import { Usuario, Cargo } from '../../../domain/entities/usuario.entity';
import { USUARIOS_REPOSITORY_TOKEN } from '../../../modules/users/constants';

@Injectable()
export class DeleteUsuarioUseCase {
  constructor(
    @Inject(USUARIOS_REPOSITORY_TOKEN)
    private readonly usuariosRepository: IUsuariosRepository,
  ) {}

  async execute(
    id: number,
  ): Promise<{ message: string; id: number; email: string }> {
    // Verificar se o usuário existe
    const usuario = await this.usuariosRepository.findOne(id);
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    // Verificar se não é o último admin
    if (usuario.cargo === Cargo.ADMIN) {
      const adminUsers = await this.usuariosRepository.findByCargo(Cargo.ADMIN);
      if (adminUsers.length <= 1) {
        throw new Error(
          'Não é possível remover o último administrador do sistema',
        );
      }
    }

    // Soft delete
    await this.usuariosRepository.remove(id);

    return {
      message: 'Usuário removido com sucesso',
      id: usuario.id,
      email: usuario.email || '',
    };
  }
}
