import { Injectable } from '@angular/core';
import { AppConfigService } from '../../services/app-config.service';
import { LogLevel } from '../../utils/util';
@Injectable()


export class LoggerService {
  // private logLevel: number = LogLevel.Debug
  private logLevel: number;

  // Error = 0,
  // Warn = 1,
  // Info = 2,
  // Debug = 3

  constructor(
    public appConfigService: AppConfigService
  ) {

  }


  initilaizeLoger() {
    const config = this.appConfigService.getConfig();
    const rawLogLevel = config?.logLevel;

    if (typeof rawLogLevel !== 'string' || rawLogLevel.length === 0) {
      this.logLevel = LogLevel.ERROR;
      return;
    }

    const normalized = rawLogLevel.toUpperCase();
    const levels: Record<string, number> = {
      ERROR: LogLevel.ERROR,
      WARN: LogLevel.WARN,
      INFO: LogLevel.INFO,
      DEBUG: LogLevel.DEBUG,
    };

    if (levels[normalized] !== undefined) {
      this.logLevel = levels[normalized];
      if (this.logLevel === LogLevel.DEBUG) {
        console.info('%c ### DSHBRD [LOGGER-SERV] Log Level: DEBUG ', 'color: #1a73e8');
      }
      return;
    }

    this.logLevel = LogLevel.ERROR;
  }


  error(...message: any[]) {
    if (this.logLevel >= LogLevel.ERROR) {
      console.error(message)
    }
  }

  warn(...message: any[]) {
    if (this.logLevel >= LogLevel.WARN) {
      console.warn(message)
    }
  }

  info(...message: any[]) {
    if (this.logLevel >= LogLevel.INFO) {
      console.info(message)
    }
  }

  debug(...message: any[]) {
    if (this.logLevel >= LogLevel.DEBUG) {
      console.debug(message)
    }
  }

  log(...message: any[]) {
    if (this.logLevel >= LogLevel.DEBUG) {
      console.log(message)
    }
  }

  // debug(...args: any[]) {
  //   if (this.logLevel == this.LEVEL_DEBUG) {
  //     console.debug.apply(console, args)
  //   }
  // }

  // log(...args: any[]) {
  //   if (this.logLevel == this.LEVEL_DEBUG) {
  //     console.log.apply(console, args)
  //   }
  // }

  // info(...args: any[]) {
  //   if (this.logLevel <= this.LEVEL_INFO) {
  //     console.info.apply(console, args)
  //   }
  // }

  // error(...args: any[]) {
  //   // if (this.logLevel <= LEVEL_ERROR) {
  //   console.error.apply(console, args)
  //   // }
  // }


}
