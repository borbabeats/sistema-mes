import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Inject } from '@nestjs/common';
import { Logger } from 'winston';

@Injectable()
export class LoggerService implements NestLoggerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  debug(message: string, meta?: any, context?: string) {
    this.logger.debug(message, { ...meta, context });
  }

  verbose(message: string, meta?: any, context?: string) {
    this.logger.verbose(message, { ...meta, context });
  }

  warn(message: string, meta?: any, context?: string) {
    this.logger.warn(message, { ...meta, context });
  }

  // Métodos customizados para facilitar o uso
  info(message: string, meta?: any, context?: string) {
    this.logger.info(message, { ...meta, context });
  }

  errorWithMeta(message: string, error: Error, meta?: any, context?: string) {
    this.logger.error(message, {
      error: error.message,
      stack: error.stack,
      ...meta,
      context,
    });
  }
}
