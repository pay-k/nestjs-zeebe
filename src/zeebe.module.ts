import { Module, OnModuleDestroy, DynamicModule, Provider } from '@nestjs/common';
import * as ZB from 'zeebe-node';
import { ModuleRef } from '@nestjs/core';
import { ZBClientOptions } from 'zeebe-node/dist/lib/interfaces';
import { ZEEBE_OPTIONS_PROVIDER, ZEEBE_CONNECTION_PROVIDER } from './zeebe.constans';
import { ZeebeClientOptions, ZeebeAsyncOptions } from './zeebe.interfaces';

@Module({})
export class ZeebeModule implements OnModuleDestroy {
    constructor(private readonly moduleRef: ModuleRef) {}

    public static forRoot(options : ZeebeClientOptions): DynamicModule {
        const optionsProviders: Provider[] = [];
        const connectionProviders: Provider[] = [];
    
        optionsProviders.push(this.createOptionsProvider(options));
    
        connectionProviders.push(this.createConnectionProvider());
        
        return {
          module: ZeebeModule,
          providers: [
            ...optionsProviders,
            ...connectionProviders,
          ],
          exports: connectionProviders,
        };
    }

    public static forRootAsync(options: ZeebeAsyncOptions): DynamicModule {
        const connectionProviders: Provider[] = [];
        connectionProviders.push(this.createConnectionProvider());

        return {
          module: ZeebeModule,
          providers: [
            {
              provide: ZEEBE_OPTIONS_PROVIDER,
              useFactory: options.useFactory,
              inject: options.inject || [],
            },
            ...connectionProviders,
          ],
          exports: connectionProviders,
        };
      }
    
    public static forFeature(): DynamicModule {
        return {
            module: ZeebeModule,
        };
    }

    private static createOptionsProvider(options : ZeebeClientOptions): Provider {
        return {
            provide: ZEEBE_OPTIONS_PROVIDER,
            useValue: options,
        };
    }
    
    private static createConnectionProvider(): Provider {
        return {
            provide: ZEEBE_CONNECTION_PROVIDER,
            //TODO resolve host url: do I need to? Seems to work aready? Just verify
            useFactory: async (config: ZeebeClientOptions ) => { console.log(config.gatewayAddress); return new ZB.ZBClient(config.gatewayAddress, config.options); },
            inject: [ZEEBE_OPTIONS_PROVIDER],
        };
    }
    onModuleDestroy() {
        throw new Error("Method not implemented.");
    }
}
