import { Module, OnModuleDestroy, DynamicModule, Provider } from '@nestjs/common';
import * as ZB from 'zeebe-node';
import { ModuleRef } from '@nestjs/core';
import { ZBClientOptions } from 'zeebe-node/dist/lib/interfaces';
import { ZEEBE_OPTIONS_PROVIDER, ZEEBE_CONNECTION_PROVIDER } from './zeebe.constans';

@Module({})
export class ZeebeModule implements OnModuleDestroy {
    constructor(private readonly moduleRef: ModuleRef) {}

    public static forRoot(gatewayAddress: string, options: ZBClientOptions = {}): DynamicModule {
        console.log('forRoot');
        const optionsProviders: Provider[] = [];
        const connectionProviders: Provider[] = [];
    
        optionsProviders.push(this.createOptionsProvider(gatewayAddress, options));
    
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

    public static forRootAsync(gatewayAddress: string, options: ZBClientOptions): DynamicModule {
    
        // const connectionProviders = [
        //   {
        //     provide: createConnectionToken('default'),
        //     useFactory: async (config: AmqpOptionsInterface) => await from(amqp.connect(config)).pipe(retry(options.retrys, options.retryDelay)).toPromise(),
        //     inject: [createOptionsToken('default')],
        //   },
        // ];
    
        // return {
        //   module: AmqpModule,
        //   providers: [
        //     {
        //       provide: createOptionsToken('default'),
        //       useFactory: options.useFactory,
        //       inject: options.inject || [],
        //     },
        //     ...connectionProviders,
        //   ],
        //   exports: connectionProviders,
        // };
        return null;
      }
    
    public static forFeature(): DynamicModule {
        return {
            module: ZeebeModule,
        };
    }

    private static createOptionsProvider(gatewayAddress: string, options: ZBClientOptions): Provider {
        return {
            provide: ZEEBE_OPTIONS_PROVIDER,
            useValue: { gatewayAddress, options },
        };
    }
    
    private static createConnectionProvider(): Provider {
        return {
            provide: ZEEBE_CONNECTION_PROVIDER,
            //TODO resolve host url: do I need to? Seems to work aready? Just verify
            useFactory: async (config: { gatewayAddress: string, options: ZBClientOptions} ) => { console.log(config.gatewayAddress); return new ZB.ZBClient(config.gatewayAddress, config.options); },
            inject: [ZEEBE_OPTIONS_PROVIDER],
        };
    }
    onModuleDestroy() {
        throw new Error("Method not implemented.");
    }
}
