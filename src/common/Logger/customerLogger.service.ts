import { Injectable, LoggerService as ILoggerService } from '@nestjs/common';
import { Logger, createLogger, transports, format } from 'winston';

@Injectable()
export class CustomLoggerService implements ILoggerService {
  private readonly _logger: Logger;

  constructor() {
    this._logger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}] - ${message}`;
        }),
      ),
      transports: [new transports.Console()],
    });
  }

  private baseLog(level: string, message: any, ...optionalParams: any[]): void {
    this._logger.log(level, message, ...optionalParams);
  }

  log(message: any, ...optionalParams: any[]): void {
    this.baseLog('info', message, ...optionalParams);
  }

  info(message: any, ...optionalParams: any[]): void {
    this.baseLog('info', message, ...optionalParams);
  }

  debug(message: any, ...optionalParams: any[]): void {
    this.baseLog('debug', message, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]): void {
    this.baseLog('warn', message, ...optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]): void {
    this.baseLog('verbose', message, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]): void {
    this.baseLog('error', message, ...optionalParams);
  }
}
