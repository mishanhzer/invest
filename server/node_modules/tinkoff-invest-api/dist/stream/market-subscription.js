/**
 * Класс подписки в стриме market.
 * Позволяет ожидать результата подписки и вызывать обработчики для figi, заданных при подписке.
 * See: https://github.com/vitalets/tinkoff-invest-api/issues/6
 */
import { SubscriptionStatus } from '../generated/marketdata.js';
export class MarketSubscription {
    constructor(options) {
        this.options = options;
        this.handler = this.handler.bind(this);
    }
    getRequest(subscriptionAction) {
        return this.options.buildRequest(subscriptionAction);
    }
    handler(res) {
        const uniRes = this.options.buildResponse(res);
        this.statusHandler(uniRes);
        this.dataHandler(uniRes);
    }
    async waitStatus() {
        try {
            await new Promise((resolve, reject) => {
                this.waitingStatusResolve = resolve;
                this.waitingStatusReject = reject;
            });
        }
        finally {
            this.waitingStatusResolve = undefined;
            this.waitingStatusReject = undefined;
        }
    }
    // eslint-disable-next-line complexity
    statusHandler({ subscriptions, subscriptionKeys, trackingId }) {
        if (!this.waitingStatusResolve || !this.waitingStatusReject)
            return;
        if (!subscriptions || !subscriptionKeys)
            return;
        if (subscriptionKeys.sort().join() !== this.options.requestKeys.sort().join())
            return;
        const errorSubscriptions = subscriptions
            .filter(s => s.subscriptionStatus !== SubscriptionStatus.SUBSCRIPTION_STATUS_SUCCESS);
        if (errorSubscriptions.length) {
            const error = this.buildSubscriptionError(errorSubscriptions, trackingId);
            this.waitingStatusReject(error);
        }
        else {
            this.waitingStatusResolve();
        }
    }
    dataHandler({ data, dataKey }) {
        if (!data || !dataKey)
            return;
        if (this.options.requestKeys.includes(dataKey)) {
            this.options.dataHandler(data);
        }
    }
    buildSubscriptionError(errorSubscriptions, trackingId) {
        const lines = errorSubscriptions.map(s => `${s.figi}: status ${s.subscriptionStatus}`);
        return new Error([
            'Subscription error:',
            ...lines,
            `TrackingId: ${trackingId}`,
        ].join('\n'));
    }
}
//# sourceMappingURL=market-subscription.js.map