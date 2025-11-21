"use strict";
/**
 * Класс расчета дат загрузки чанков для отдельных файлов.
 * Бежит в прошлое с заданным шагом (день/год).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateIterator = void 0;
const marketdata_js_1 = require("../generated/marketdata.js");
const date_js_1 = require("../utils/date.js");
// сохраняем оригинальный конструктор Date(), т.к. при бэктесте он подменяется.
const OriginalDate = Date;
class DateIterator {
    constructor(req, debug) {
        this.req = req;
        this.debug = debug;
        this.isYearChunk = req.interval === marketdata_js_1.CandleInterval.CANDLE_INTERVAL_DAY;
        this.to = req.to || new Date();
        this.initialChunkDate = this.calcInitialChunkDate();
        this.currentChunkDate = new Date(this.initialChunkDate);
    }
    nextChunk() {
        this.addChunkDateStep(this.currentChunkDate, -1);
    }
    getCurrentChunkRange() {
        const from = new Date(this.currentChunkDate);
        if (this.isYearChunk)
            from.setUTCMonth(0, 1);
        const to = new Date(from);
        this.addChunkDateStep(to, 1);
        return { from, to };
    }
    needTodayCandles() {
        const todayMidnight = new OriginalDate();
        todayMidnight.setUTCHours(0, 0, 0, 0);
        return this.to > todayMidnight;
    }
    /**
     * Суммарный диапазон from/to, по которому были загружены свечи.
     */
    getTotalRange() {
        const afterInitialChunk = this.addChunkDateStep(new Date(this.initialChunkDate), 1);
        const maxTo = Math.max(afterInitialChunk.valueOf(), this.to.valueOf());
        return {
            from: this.currentChunkDate,
            to: new Date(maxTo),
        };
    }
    calcInitialChunkDate() {
        // вычитаем 1мс, т.к. само значение to не включается в фильтр.
        // если to = 2022-04-29T00:00:00+03:00, то в результате нужны свечи только за 2022-04-28
        const date = new Date(this.to.valueOf() - 1);
        date.setUTCHours(0, 0, 0, 0);
        return date;
    }
    addChunkDateStep(date, count) {
        return this.isYearChunk ? (0, date_js_1.addYears)(date, count) : (0, date_js_1.addDays)(date, count);
    }
}
exports.DateIterator = DateIterator;
//# sourceMappingURL=date-iterator.js.map