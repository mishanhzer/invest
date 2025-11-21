"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradesStream = void 0;
/**
 * Класс для подписок на сделки.
 * See: https://tinkoff.github.io/investAPI/orders/#ordersstreamservice
 */
const base_js_1 = require("./base.js");
class TradesStream extends base_js_1.BaseStream {
    /**
     * Подписаться на обновления.
     */
    watch(request) {
        // тут работает немного по-другому, т.к. request не AsyncIterable
        const call = this.api.ordersStream.tradesStream(request);
        this.waitEvents(call);
    }
}
exports.TradesStream = TradesStream;
//# sourceMappingURL=trades.js.map