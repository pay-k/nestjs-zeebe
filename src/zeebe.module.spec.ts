import { ZeebeModule } from './zeebe.module';
/* tslint:disable:only-arrow-functions max-classes-per-file */
import { Injectable, Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { expect } from 'chai';
import { ZEEBE_CONNECTION_PROVIDER } from './zeebe.constans';

describe('Winston module', function() {
  it('boots successfully', async function() {
    const rootModule = await Test.createTestingModule({
      imports: [
        ZeebeModule.forRoot({ gatewayAddress: 'localhost:26500' }),
      ],
    }).compile();

    expect(rootModule.get(ZEEBE_CONNECTION_PROVIDER)).to.be.an('object');
  });

  it('boots successfully asynchronously', async function() {
    @Injectable()
    class ConfigService {
      public loggerOptions = { gatewayAddress: 'localhost:26500' };
    }

    @Module({
        providers: [ConfigService],
        exports: [ConfigService],
      })
      class FeatureModule {}

    const rootModule = await Test.createTestingModule({
      imports: [
        ZeebeModule.forRootAsync({
        imports: [FeatureModule],
          useFactory: (cfg: ConfigService) => { return cfg.loggerOptions; },
          inject: [ConfigService],
        }),
      ]
    }).compile();

    const app = rootModule.createNestApplication();
    await app.init();

    expect(rootModule.get(ZEEBE_CONNECTION_PROVIDER)).to.be.an('object');
  });
});