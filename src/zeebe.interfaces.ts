import { ZBWorkerOptions } from "zeebe-node/dist/lib/interfaces";

export interface WorkerProperties {
    type: string;
    options: ZBWorkerOptions;
}
