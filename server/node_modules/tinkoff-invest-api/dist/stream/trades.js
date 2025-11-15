/**
 * Класс для подписок на сделки.
 * See: https://tinkoff.github.io/investAPI/orders/#ordersstreamservice
 */
import { BaseStream } from './base.js';
export class TradesStream extends BaseStream {
    /**
     * Подписаться на обновления.
     */
    watch(request) {
        // тут работает немного по-другому, т.к. request не AsyncIterable
        const call = this.api.ordersStream.tradesStream(request);
        this.waitEvents(call);
    }
}
//# sourceMappingURL=trades.js.map