<p align="center">
  <a href="http://nestjs.com"><img src="https://nestjs.com/img/logo_text.svg" alt="Nest Logo" width="320" /></a>
</p>

# NestJS Zeebe Connector (Transport and Client)
A zeebe transport and client for NestJS

Using the zeebe-node module and exposing it as a NestJS transport and module.

<p align="center">
  
[![Build Status](https://dev.azure.com/payk/PayK%20Public/_apis/build/status/pay-k.nestjs-zeebe?branchName=master)](https://dev.azure.com/payk/PayK%20Public/_build/latest?definitionId=1&branchName=master)

</p>


## Install
    npm install @payk/nestjs-zeebe

## Basic usage


```ts
    // app.module.ts
    import { Module } from '@nestjs/common';
    import { AppController } from './app.controller';
    import { ZeebeModule, ZeebeServer } from '@payk/nestjs-zeebe';

    @Module({
    imports: [ ZeebeModule.forRoot({ gatewayAddress: 'localhost:26500' })],
    controllers: [AppController],
    providers: [ZeebeServer],
    })
    export class AppModule {}
```

```ts
    // main.ts
    import { NestFactory } from '@nestjs/core';
    import { AppModule } from './app.module';
    import { ZeebeServer } from '@payk/nestjs-zeebe';

    async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const microservice = app.connectMicroservice({
        strategy: app.get(ZeebeServer),
    });

    await app.startAllMicroservicesAsync();

    await app.listen(3000);
    }
    bootstrap();

```

```ts
    // app.controller.ts
    import { Controller, Get, Inject } from '@nestjs/common';
    import { AppService } from './app.service';
    import { ZBClient } from 'zeebe-node';
    import { CreateWorkflowInstanceResponse, CompleteFn, Job } from 'zeebe-node/interfaces';
    import { ZEEBE_CONNECTION_PROVIDER, ZeebeWorker } from '@payk/nestjs-zeebe';

    @Controller()
    export class AppController {
        constructor(private readonly appService: AppService, @Inject(ZEEBE_CONNECTION_PROVIDER) private readonly zbClient: ZBClient) {}

        // Use the client to create a new workflow instance
        @Get()
        getHello() : Promise<CreateWorkflowInstanceResponse> {
            return this.zbClient.createWorkflowInstance('order-process', { test: 1, or: 'romano'});
        }

        // Subscribe to events of type 'payment-service
        @ZeebeWorker('payment-service')
        paymentService(job: Job, complete: CompleteFn) {
            console.log('Payment-service, Task variables', job.variables);
            let updatedVariables = Object.assign({}, job.variables, {
            paymentService: 'Did my job',
            });

            // Task worker business logic goes here

            complete.success(updatedVariables);
        }

        // Subscribe to events of type 'inventory-service and create a worker with the options as passed below (zeebe-node ZBWorkerOptions)
        @ZeebeWorker('inventory-service', { maxJobsToActivate: 10, timeout: 300 })
        inventoryService(job: Job, complete: CompleteFn) {
            console.log('inventory-service, Task variables', job.variables);
            let updatedVariables = Object.assign({}, job.variables, {
            inventoryVar: 'Inventory donnnneee',
            });

            // Task worker business logic goes here

            complete.success(updatedVariables);
        }
    }

```
