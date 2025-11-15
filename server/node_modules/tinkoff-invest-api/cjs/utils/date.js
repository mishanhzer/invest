"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDays = exports.addYears = exports.formatDateUTC = void 0;
function formatDateUTC(date, tpl) {
    return tpl
        .replace('YYYY', String(date.getUTCFullYear()))
        .replace('MM', addLeadingZero(date.getUTCMonth() + 1))
        .replace('DD', addLeadingZero(date.getUTCDate()))
        .replace('hh', addLeadingZero(date.getUTCHours()))
        .replace('mm', addLeadingZero(date.getUTCMinutes()))
        .replace('ss', addLeadingZero(date.getUTCSeconds()))
        .replace('SSS', addLeadingZero(date.getUTCMilliseconds(), 2));
}
exports.formatDateUTC = formatDateUTC;
function addLeadingZero(value, length = 2) {
    const strValue = String(value);
    const zeros = strValue.length < length ? '0'.repeat(length - strValue.length) : '';
    return `${zeros}${strValue}`;
}
function addYears(date, years) {
    date.setFullYear(date.getFullYear() + years);
    return date;
}
exports.addYears = addYears;
function addDays(date, days) {
    date.setDate(date.getDate() + days);
    return date;
}
exports.addDays = addDays;
//# sourceMappingURL=date.js.map