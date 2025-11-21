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
import { TinkoffInvestApi } from '../api.js';
import { CandlesReqParams } from './req.js';
export interface CandlesLoaderOptions {
    /** Директория для кеширования свечей */
    cacheDir?: string;
}
export declare class CandlesLoader {
    protected api: TinkoffInvestApi;
    protected options: Required<CandlesLoaderOptions>;
    protected debug: Debug.Debugger;
    constructor(api: TinkoffInvestApi, options?: CandlesLoaderOptions);
    getCandles(req: CandlesReqParams): Promise<{
        candles: import("../generated/marketdata.js").HistoricCandle[];
    }>;
}
//# sourceMappingURL=index.d.ts.map