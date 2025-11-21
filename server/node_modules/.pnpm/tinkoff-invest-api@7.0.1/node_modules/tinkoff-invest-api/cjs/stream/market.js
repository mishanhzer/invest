"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketStream = void 0;
/**
 * Класс для подписок на realtime marketdata.
 * See: https://tinkoff.github.io/investAPI/marketdata/#marketdataservice
 */
const base_js_1 = require("./base.js");
const market_subscription_js_1 = require("./market-subscription.js");
const marketdata_js_1 = require("../generated/marketdata.js");
class MarketStream extends base_js_1.BaseStream {
    constructor(api) {
        super(api);
        this.api = api;
        this.options = {
            autoReconnect: true,
            autoReconnectDelayMin: 100,
            autoReconnectDelayMax: 2000,
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.subscriptions = new Set();
        this.autoReconnectDelay = 0;
        this.emitter.on('close', error => this.onClose(error));
    }
    /**
     * Подписка на свечи.
     */
    async candles(req, dataHandler) {
        const getKey = ({ figi, interval }) => `${figi}_${interval}`;
        const subscription = new market_subscription_js_1.MarketSubscription({
            requestKeys: req.instruments.map(getKey),
            dataHandler,
            buildRequest: subscriptionAction => ({ subscribeCandlesRequest: { subscriptionAction, ...req } }),
            buildResponse: ({ candle, subscribeCandlesResponse }) => {
                const { trackingId, candlesSubscriptions: subscriptions } = subscribeCandlesResponse || {};
                return {
                    trackingId,
                    subscriptions,
                    subscriptionKeys: subscriptions && subscriptions.map(getKey),
                    data: candle,
                    dataKey: candle && getKey(candle),
                };
            },
        });
        return this.watch(subscription);
    }
    /**
     * Подписка на сделки.
     */
    async trades(req, dataHandler) {
        const getKey = ({ figi }) => figi;
        const subscription = new market_subscription_js_1.MarketSubscription({
            requestKeys: req.instruments.map(getKey),
            dataHandler,
            buildRequest: subscriptionAction => ({ subscribeTradesRequest: { subscriptionAction, ...req } }),
            buildResponse: ({ trade, subscribeTradesResponse }) => {
                const { trackingId, tradeSubscriptions: subscriptions } = subscribeTradesResponse || {};
                return {
                    trackingId,
                    subscriptions,
                    subscriptionKeys: subscriptions && subscriptions.map(getKey),
                    data: trade,
                    dataKey: trade && getKey(trade),
                };
            },
        });
        return this.watch(subscription);
    }
    /**
     * Подписка на стакан.
     */
    async orderBook(req, dataHandler) {
        const getKey = ({ figi, depth }) => `${figi}_${depth}`;
        const subscription = new market_subscription_js_1.MarketSubscription({
            requestKeys: req.instruments.map(getKey),
            dataHandler,
            buildRequest: subscriptionAction => ({ subscribeOrderBookRequest: { subscriptionAction, ...req } }),
            buildResponse: ({ orderbook, subscribeOrderBookResponse }) => {
                const { trackingId, orderBookSubscriptions: subscriptions } = subscribeOrderBookResponse || {};
                return {
                    trackingId,
                    subscriptions,
                    subscriptionKeys: subscriptions && subscriptions.map(getKey),
                    data: orderbook,
                    dataKey: orderbook && getKey(orderbook),
                };
            },
        });
        return this.watch(subscription);
    }
    /**
     * Подписка на цены.
     */
    async lastPrice(req, dataHandler) {
        const getKey = ({ figi }) => figi;
        const subscription = new market_subscription_js_1.MarketSubscription({
            requestKeys: req.instruments.map(getKey),
            dataHandler,
            buildRequest: subscriptionAction => ({ subscribeLastPriceRequest: { subscriptionAction, ...req } }),
            buildResponse: ({ lastPrice, subscribeLastPriceResponse }) => {
                const { trackingId, lastPriceSubscriptions: subscriptions } = subscribeLastPriceResponse || {};
                return {
                    trackingId,
                    subscriptions,
                    subscriptionKeys: subscriptions && subscriptions.map(getKey),
                    data: lastPrice,
                    dataKey: lastPrice && getKey(lastPrice),
                };
            },
        });
        return this.watch(subscription);
    }
    /**
     * Подписка на информацию об инструменте.
     */
    async info(req, dataHandler) {
        const getKey = ({ figi }) => figi;
        const subscription = new market_subscription_js_1.MarketSubscription({
            requestKeys: req.instruments.map(getKey),
            dataHandler,
            buildRequest: subscriptionAction => ({ subscribeInfoRequest: { subscriptionAction, ...req } }),
            buildResponse: ({ tradingStatus, subscribeInfoResponse }) => {
                const { trackingId, infoSubscriptions: subscriptions } = subscribeInfoResponse || {};
                return {
                    trackingId,
                    subscriptions,
                    subscriptionKeys: subscriptions && subscriptions.map(getKey),
                    data: tradingStatus,
                    dataKey: tradingStatus && getKey(tradingStatus),
                };
            },
        });
        return this.watch(subscription);
    }
    /**
     * Получение текущих подписок.
     */
    async getMySubscriptions() {
        this.ensureConnected();
        this.sendRequest({ getMySubscriptions: {} });
        return new Promise(resolve => {
            const unsubscribe = this.on('data', res => {
                if (isDataResponse(res))
                    return;
                unsubscribe();
                resolve(res);
            });
        });
    }
    async reconnect() {
        // вызываем явно на случай если подписок нет
        this.ensureConnected();
        // todo: если коннект есть, но хотя бы одна из подписок не может установиться, то весь reconnect фейлится.
        // Кажется, это не совсем корректно.
        for (const subscription of this.subscriptions) {
            await this.watch(subscription);
        }
        this.autoReconnectDelay = 0;
    }
    ensureConnected() {
        if (!this.connected) {
            const req = this.createRequestIterable();
            // todo: тут не совсем понимаю, как асинхронно дождаться что соединение установлено
            const call = this.api.marketdataStream.marketDataStream(req);
            this.waitEvents(call);
        }
    }
    onClose(error) {
        this.subscriptions.forEach(subscription => this.off('data', subscription.handler));
        if (error && this.options.autoReconnect) {
            setTimeout(() => this.reconnect(), this.autoReconnectDelay);
            this.calcAutoReconnectDelay();
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async watch(subscription) {
        this.ensureConnected();
        this.sendRequest(subscription.getRequest(marketdata_js_1.SubscriptionAction.SUBSCRIPTION_ACTION_SUBSCRIBE));
        if (!this.hasListener('data', subscription.handler)) {
            this.on('data', subscription.handler);
        }
        try {
            await subscription.waitStatus();
        }
        catch (e) {
            this.off('data', subscription.handler);
            throw e;
        }
        this.subscriptions.add(subscription);
        return () => this.unwatch(subscription);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async unwatch(subscription) {
        this.sendRequest(subscription.getRequest(marketdata_js_1.SubscriptionAction.SUBSCRIPTION_ACTION_UNSUBSCRIBE));
        await subscription.waitStatus();
        this.off('data', subscription.handler);
        this.subscriptions.delete(subscription);
    }
    calcAutoReconnectDelay() {
        this.autoReconnectDelay = this.autoReconnectDelay === 0
            ? this.options.autoReconnectDelayMin
            : Math.min(this.autoReconnectDelay * 2, this.options.autoReconnectDelayMax);
    }
}
exports.MarketStream = MarketStream;
function isDataResponse(res) {
    return res.candle || res.lastPrice || res.orderbook || res.ping || res.trade || res.tradingStatus;
}
//# sourceMappingURL=market.js.map