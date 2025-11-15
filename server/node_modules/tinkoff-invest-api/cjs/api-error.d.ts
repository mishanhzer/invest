/**
 * Nice-grpc middleware to attach headers to thrown error.
 * See: https://github.com/deeplay-io/nice-grpc/issues/125
 */
import { ClientMiddlewareCall, CallOptions, ClientError, Status } from 'nice-grpc';
export declare class TinkoffApiError extends ClientError {
    trackingId: string;
    envoyUpstreamServiceTime: string;
    ratelimit: string;
    ratelimitRemaining: string;
    ratelimitReset: string;
    constructor(path: string, code: Status, details: string);
}
export declare function errorMiddleware<Request, Response>(call: ClientMiddlewareCall<Request, Response>, options: CallOptions): AsyncGenerator<Awaited<Response>, void | Awaited<Response>, undefined>;
//# sourceMappingURL=api-error.d.ts.map