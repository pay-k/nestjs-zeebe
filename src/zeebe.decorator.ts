import { MessagePattern, PatternMetadata } from '@nestjs/microservices';
import { ZeebeWorkerProperties } from './zeebe.interfaces';

export const ZeebeWorker =  <T = string | ZeebeWorkerProperties>(options: T) => {
    return MessagePattern(options);
};