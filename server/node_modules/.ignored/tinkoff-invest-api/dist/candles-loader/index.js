/**
 * Загрузчик свечей.
 * - позволяет загрузить необходимое кол-во свечей из прошлого
 * - использует кеш на файловой системе
 *
 * Структура кеша:
 * <figi>
 *   1_min
 *      2022-05-01.json
 *      2022-05-02.json
 *   5_min
 *      2022-05-01.json
 *      2022-05-02.json
 *   15_min
 *      2022-05-01.json
 *      2022-05-02.json
 *   hour
 *      2022-05-01.json
 *      2022-05-02.json
 *   day
 *      2020.json
 *      2021.json
 *      2022.json
 */
import Debug from 'debug';
import { CandlesReq } from './req.js';
const defaults = {
    cacheDir: '.cache',
};
export class CandlesLoader {
    constructor(api, options = {}) {
        this.api = api;
        this.debug = Debug('tinkoff-invest-api:candles-loader');
        this.options = Object.assign({}, defaults, options);
    }
    async getCandles(req) {
        const candlesReq = new CandlesReq(this.api, this.options, req, this.debug);
        const candles = await candlesReq.getCandles();
        return { candles };
    }
}
//# sourceMappingURL=index.js.map