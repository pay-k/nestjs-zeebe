import { ZeebeExceptionFilter } from './zeebe.exception.filter';
import { MessagePattern, Transport } from '@nestjs/microservices';
import { ZBWorkerOptions } from 'zeebe-node/interfaces';
import { UseFilters } from '@nestjs/common';


export /**
 * A decorator that auto exposes the end-point as a Zeebe worker and overrides the NestJS
 * Exception handling to allow failing a job once an exception is thrown.


 * @param {string} type
 * @param {ZBWorkerOptions} [options]
 * @returns {MethodDecorator}
 */
const ZeebeWorker =  (type: string, options?: ZBWorkerOptions) : MethodDecorator => {
    return (...args) => {
        let messagePattern = MessagePattern({ type, options: options || null }, Transport.TCP);
        let exceptionFilter = UseFilters(ZeebeExceptionFilter);

        if (typeof args[1] === "string") {
            exceptionFilter(args[0], args[1], args[2]);
        }
        messagePattern(...args);
    }
};
