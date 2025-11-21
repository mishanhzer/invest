/**
 * Класс для подписок на сделки.
 * See: https://tinkoff.github.io/investAPI/orders/#ordersstreamservice
 */
import { BaseStream } from './base.js';
import { TradesStreamRequest, TradesStreamResponse } from '../generated/orders.js';
export declare class TradesStream extends BaseStream<TradesStreamRequest, TradesStreamResponse> {
    /**
     * Подписаться на обновления.
     */
    watch(request: TradesStreamRequest): void;
}
//# sourceMappingURL=trades.d.ts.map