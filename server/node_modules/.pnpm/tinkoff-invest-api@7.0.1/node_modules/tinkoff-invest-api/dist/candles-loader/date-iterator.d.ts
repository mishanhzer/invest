/**
 * Класс расчета дат загрузки чанков для отдельных файлов.
 * Бежит в прошлое с заданным шагом (день/год).
 */
import Debug from 'debug';
import { CandlesReqParams } from './req.js';
export declare class DateIterator {
    protected req: CandlesReqParams;
    protected debug: Debug.Debugger;
    isYearChunk: boolean;
    to: Date;
    initialChunkDate: Date;
    currentChunkDate: Date;
    constructor(req: CandlesReqParams, debug: Debug.Debugger);
    nextChunk(): void;
    getCurrentChunkRange(): {
        from: Date;
        to: Date;
    };
    needTodayCandles(): boolean;
    /**
     * Суммарный диапазон from/to, по которому были загружены свечи.
     */
    getTotalRange(): {
        from: Date;
        to: Date;
    };
    protected calcInitialChunkDate(): Date;
    protected addChunkDateStep(date: Date, count: number): Date;
}
//# sourceMappingURL=date-iterator.d.ts.map