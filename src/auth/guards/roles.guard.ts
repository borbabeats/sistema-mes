import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Cargo } from '../entities/usuario.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Cargo[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // Se não houver restrições de papel, permite o acesso
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (!user) {
      throw new ForbiddenException('Usuário não autenticado');
    }

    if (!user.cargo) {
      throw new ForbiddenException('Usuário não possui cargo definido');
    }

    const hasRole = requiredRoles.some((role) => user.cargo === role);
    
    if (!hasRole) {
      const rolesString = requiredRoles.join(' ou ');
      throw new ForbiddenException(
        `Acesso negado. Esta operação requer o cargo de: ${rolesString}. `
      );
    }

    return true;
  }
}