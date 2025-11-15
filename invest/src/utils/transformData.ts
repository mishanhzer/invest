import { SECTOR_BONDS, CURRENCY_SYMBOLS, COUPON_PERIOD } from "./constants";

import type { TypesCoupons, TypesBonds, TypesOptions } from "./types";

// Функция трансформации даты в нужный формат
const tranformDate = (date: string) => {
  const mainDate = new Date(date)

  const options: TypesOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }

  const ruLong = mainDate.toLocaleDateString('ru', options).replace(/s*г\./,'').trim()
  return ruLong
}

// Итерация возможных валют и возвращения нужного символа валюты
// const currencySymbolIterate = (currency: string) => {
//   return CURRENCY_SYMBOLS[currency] || ''
// }

// Трансформация данных купонов
export const _transformDataCoupons = (coupon: TypesCoupons) => {
  // const currencySymbol = currencySymbolIterate(coupon.payOneBond.currency)
  const priceCoupon = `${coupon.payOneBond?.units},${coupon.payOneBond?.nano / 10000000}`
  const num = parseFloat(priceCoupon.replace(',', '.'))

  const couponPeriod = COUPON_PERIOD[coupon.couponPeriod] || ''
  return {
    figi: coupon.figi,
    couponPeriodNumber: coupon.couponPeriod,
    couponPeriod,
    couponEndDate: tranformDate(coupon.couponEndDate),
    payOneBond: num,
  };
  };


// Трансформация данных облигаций
 export const _transformDataBonds = (bond: TypesBonds) => {
  const sector = SECTOR_BONDS[bond.sector] || 'Неизвестный';
  // const currencySymbol = CURRENCY_SYMBOLS[bond.nominal.currency] || ''
  // const currencySymbol = currencySymbolIterate(bond.nominal.currency)

  return {
    figi: bond.figi,
    ticker: bond.ticker,
    maturityDate: tranformDate(bond.maturityDate),
    name: bond.name,
    // nominal: `${bond.nominal.units}${currencySymbol}`,
    nominal: bond.nominal.units,
    riskLevel: bond.riskLevel,
    sector: sector,
  }
};
