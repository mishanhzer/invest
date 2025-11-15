/**
 * Базовый класс обертки на bi-directional grpc stream.
 */
import { on, EventEmitter, once } from 'node:events';
// Используем null как специальное значение, чтобы выйти из цикла в async итераторе и закрыть соединение
const CLOSE_STREAM_VALUE = null;
export class BaseStream {
    constructor(api) {
        this.api = api;
        this.connected = false;
        this.emitter = new EventEmitter();
    }
    /**
     * Установить обработчик.
     */
    on(event, handler) {
        this.emitter.on(event, handler);
        return () => this.emitter.off(event, handler);
    }
    /**
     * Удалить обработчик.
     */
    off(event, handler) {
        this.emitter.off(event, handler);
    }
    /**
     * Установлен ли обработчик.
     */
    hasListener(event, handler) {
        return this.emitter.listeners(event).includes(handler);
    }
    /**
     * Отмена запроса.
     */
    async cancel() {
        if (this.connected) {
            this.sendRequest(CLOSE_STREAM_VALUE);
            const [error] = await once(this.emitter, 'close');
            return error;
            // todo: remove all data listeners?
            // this.emitter.removeAllListeners('data');
        }
    }
    async *createRequestIterable() {
        const innerReq = on(this.emitter, 'request');
        // events.on эмитит данные в виде массива (https://nodejs.org/api/events.html#eventsonemitter-eventname-options)
        // поэтому трансформируем все вызовы в новый AsyncIterable, куда передается только первый аргумент
        for await (const data of innerReq) {
            const value = data[0];
            if (value === CLOSE_STREAM_VALUE)
                break;
            yield value;
        }
    }
    sendRequest(req) {
        this.emitter.emit('request', req);
    }
    async waitEvents(call) {
        this.connected = true;
        this.emitter.emit('open');
        let error = undefined;
        try {
            for await (const data of call) {
                this.emitter.emit('data', data);
            }
        }
        catch (e) {
            error = e;
            this.emitter.emit('error', e);
        }
        finally {
            // Если вышли из цикла, значит соединение разорвано
            this.connected = false;
            this.emitter.emit('close', error);
        }
    }
}
//# sourceMappingURL=base.js.map