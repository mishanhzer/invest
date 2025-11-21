"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandlesLoader = void 0;
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
const debug_1 = __importDefault(require("debug"));
const req_js_1 = require("./req.js");
const defaults = {
    cacheDir: '.cache',
};
class CandlesLoader {
    constructor(api, options = {}) {
        this.api = api;
        this.debug = (0, debug_1.default)('tinkoff-invest-api:candles-loader');
        this.options = Object.assign({}, defaults, options);
    }
    async getCandles(req) {
        const candlesReq = new req_js_1.CandlesReq(this.api, this.options, req, this.debug);
        const candles = await candlesReq.getCandles();
        return { candles };
    }
}
exports.CandlesLoader = CandlesLoader;
//# sourceMappingURL=index.js.map