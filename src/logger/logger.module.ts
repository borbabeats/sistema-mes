import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { LoggerService } from './logger.service';
import { loggerConfig } from './logger.config';

@Module({
  imports: [
    WinstonModule.forRoot(loggerConfig),
  ],
  providers: [LoggerService],
  exports: [LoggerService, WinstonModule],
})
export class LoggerModule {}
