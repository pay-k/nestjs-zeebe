import { ZBWorkerOptions, ZBClientOptions } from "zeebe-node/interfaces";

/**
 *
 *
 * @export
 * @interface ZeebeWorkerProperties
 */
export interface ZeebeWorkerProperties {
    type: string;
    options?: ZBWorkerOptions;
}

/**
 *
 *
 * @export
 * @interface ZeebeClientOptions
 */
export interface ZeebeClientOptions {
    gatewayAddress?: string;
    options?: ZBWorkerOptions & ZBClientOptions;
}

/**
 *
 *
 * @export
 * @interface ZeebeAsyncOptions
 */
export interface ZeebeAsyncOptions {
    imports?: any[];
    inject?: any[];
    useFactory?: (
        ...args: any[]
    ) => Promise<ZeebeClientOptions> | ZeebeClientOptions;
}