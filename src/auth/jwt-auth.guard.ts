import { Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    
    // Log detalhado para debugging
    this.logger.log(`[AUTH GUARD] === REQUISIÇÃO RECEBIDA ===`);
    this.logger.log(`[AUTH GUARD] Path: ${request.path}`);
    this.logger.log(`[AUTH GUARD] Method: ${request.method}`);
    this.logger.log(`[AUTH GUARD] Authorization Header: ${token ? 'PRESENT' : 'MISSING'}`);
    this.logger.log(`[AUTH GUARD] User-Agent: ${request.headers['user-agent'] || 'NOT_FOUND'}`);
    this.logger.log(`[AUTH GUARD] Origin: ${request.headers.origin || request.headers.referer || 'NOT_FOUND'}`);
    this.logger.log(`[AUTH GUARD] X-Forwarded-For: ${request.headers['x-forwarded-for'] || 'NOT_FOUND'}`);
    
    if (token) {
      this.logger.log(`[AUTH GUARD] Token (primeiros 30 chars): ${token.substring(0, 30)}...`);
    }

    const result = super.canActivate(context);
    
    if (result) {
      this.logger.log(`[AUTH GUARD] ✅ Token VÁLIDO - Acesso permitido para: ${request.path}`);
    } else {
      this.logger.warn(`[AUTH GUARD] ❌ Token INVÁLIDO ou AUSENTE para: ${request.path}`);
      this.logger.warn(`[AUTH GUARD] Headers completos: ${JSON.stringify({
        authorization: token || 'MISSING',
        origin: request.headers.origin,
        referer: request.headers.referer,
        'x-forwarded-for': request.headers['x-forwarded-for'],
        'content-type': request.headers['content-type']
      })}`);
    }
    
    return result;
  }
}
