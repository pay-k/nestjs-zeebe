# NestJS Zeebe Connector (Transport and Client)
A zeebe transport and client for NestJS

Using the zeebe-node module and exposing it as a NestJS transport and module.

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
    // app.controller.ts
    import { Controller, Get, Inject } from '@nestjs/common';
    import { AppService } from './app.service';
    import { MessagePattern } from '@nestjs/microservices';
    import { ZBClient } from 'zeebe-node';
    import { CreateWorkflowInstanceResponse, CompleteFn } from 'zeebe-node/interfaces';
    import { ZEEBE_CONNECTION_PROVIDER } from '@payk/nestjs-zeebe';

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
        paymentService(job, complete) {
            console.log('Payment-service, Task variables', job.variables);
            let updatedVariables = Object.assign({}, job.variables, {
            paymentService: 'Did my job',
            });

            // Task worker business logic goes here

            complete(updatedVariables);
        }

        // Subscribe to events of type 'inventory-service and create a worker with the options as passed below (zeebe-node ZBWorkerOptions)
        @ZeebeWorker('inventory-service', { maxJobsToActivate: 10, timeout: 300 })
        inventoryService(job, complete) {
            console.log('inventory-service, Task variables', job.variables);
            let updatedVariables = Object.assign({}, job.variables, {
            inventoryVar: 'Inventory donnnneee',
            });

            // Task worker business logic goes here

            complete(updatedVariables);
        }
    }

```