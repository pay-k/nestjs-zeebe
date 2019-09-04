import { ZBWorkerOptions, ZBClientOptions } from "zeebe-node/dist/lib/interfaces";

export interface ZeebeWorkerProperties {
    type: string;
    options: ZBWorkerOptions;
}

export interface ZeebeClientOptions {
    gatewayAddress: string;
    options: ZBClientOptions;
}

export interface ZeebeAsyncOptions {
    inject?: any[];
    useFactory?: (
        ...args: any[]
    ) => Promise<ZeebeClientOptions> | ZeebeClientOptions;
}