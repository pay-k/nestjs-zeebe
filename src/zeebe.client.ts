import * as ZB from 'zeebe-node';
import { Injectable } from '@nestjs/common';
import { ZBClientOptions } from 'zeebe-node/interfaces';

@Injectable()
export class ZeebeClient extends ZB.ZBClient {
 constructor(gatewayAddress: string, options: ZBClientOptions = {}) {
     super(gatewayAddress, options);
 }
}