import { Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  canActivate(context) {
    const result = super.canActivate(context);
    
    return result;
  }
}
