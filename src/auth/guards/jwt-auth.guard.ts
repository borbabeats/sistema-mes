import { Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    
    // Log detalhado para debugging
    this.logger.log(`[AUTH GUARD (guards)] === REQUISIÇÃO RECEBIDA ===`);
    this.logger.log(`[AUTH GUARD (guards)] Path: ${request.path}`);
    this.logger.log(`[AUTH GUARD (guards)] Method: ${request.method}`);
    this.logger.log(`[AUTH GUARD (guards)] Authorization Header: ${token ? 'PRESENT' : 'MISSING'}`);
    this.logger.log(`[AUTH GUARD (guards)] Origin: ${request.headers.origin || request.headers.referer || 'NOT_FOUND'}`);
    
    if (token) {
      this.logger.log(`[AUTH GUARD (guards)] Token (primeiros 30 chars): ${token.substring(0, 30)}...`);
    }

    const result = super.canActivate(context);
    
    if (result) {
      this.logger.log(`[AUTH GUARD (guards)] ✅ Token VÁLIDO - Acesso permitido para: ${request.path}`);
    } else {
      this.logger.warn(`[AUTH GUARD (guards)] ❌ Token INVÁLIDO ou AUSENTE para: ${request.path}`);
    }
    
    return result;
  }
}
