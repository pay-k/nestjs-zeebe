import { ZeebeExceptionFilter } from './zeebe.exception.filter';
import { MessagePattern } from '@nestjs/microservices';
import { ZBWorkerOptions } from 'zeebe-node/interfaces';
import { UseFilters } from '@nestjs/common';

export const ZeebeWorker =  (type: string, options?: ZBWorkerOptions) : MethodDecorator => {
    return (...args) => {
        let messagePattern = MessagePattern({ type, options: options || null });
        let exceptionFilter = UseFilters(ZeebeExceptionFilter);

        if (typeof args[1] === "string") {
            exceptionFilter(args[0], args[1], args[2]);
        }
        messagePattern(...args);
    }
};