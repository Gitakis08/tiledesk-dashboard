import { TestBed } from '@angular/core/testing';

import { LoggerService } from './logger.service';
import { AppConfigService } from '../app-config.service';

describe('LoggerService', () => {
  let appConfigService: jasmine.SpyObj<AppConfigService>;

  beforeEach(() => {
    appConfigService = jasmine.createSpyObj('AppConfigService', ['getConfig']);
    TestBed.configureTestingModule({
      providers: [
        LoggerService,
        { provide: AppConfigService, useValue: appConfigService },
      ],
    });
  });

  it('should be created', () => {
    const service: LoggerService = TestBed.get(LoggerService);
    expect(service).toBeTruthy();
  });

  it('defaults to ERROR when logLevel is missing', () => {
    appConfigService.getConfig.and.returnValue({});
    const service = TestBed.get(LoggerService);
    spyOn(console, 'error');

    service.initilaizeLoger();
    service.debug('debug message');
    service.info('info message');
    service.warn('warn message');
    service.error('error message');

    expect(console.error).toHaveBeenCalled();
  });

  it('honors explicit DEBUG logLevel', () => {
    appConfigService.getConfig.and.returnValue({ logLevel: 'DEBUG' });
    const service = TestBed.get(LoggerService);
    spyOn(console, 'info');
    spyOn(console, 'debug');

    service.initilaizeLoger();
    service.debug('debug message');

    expect(console.info).toHaveBeenCalledWith('%c ### DSHBRD [LOGGER-SERV] Log Level: DEBUG ', 'color: #1a73e8');
    expect(console.debug).toHaveBeenCalled();
  });

  it('does not emit startup log level message for INFO', () => {
    appConfigService.getConfig.and.returnValue({ logLevel: 'INFO' });
    const service = TestBed.get(LoggerService);
    spyOn(console, 'info');

    service.initilaizeLoger();

    expect(console.info).not.toHaveBeenCalledWith('%c ### DSHBRD [LOGGER-SERV] Log Level: INFO ', 'color: #1a73e8');
  });
});
