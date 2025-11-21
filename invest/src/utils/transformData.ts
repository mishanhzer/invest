import { SECTOR_BONDS, CURRENCY_SYMBOLS, COUPON_PERIOD } from "./constants";

import type { TypesCoupons, TypesBonds, TypesOptions, TypesDataLastPrices } from "./types";

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

const getCoins = (units: string, nano: number) => {
  const price = `${units},${nano / 10000000}`
  return parseFloat(price.replace(',', '.'))
}

// Трансформация данных купонов
export const _transformDataCoupons = (coupon: TypesCoupons) => {
  // const currencySymbol = currencySymbolIterate(coupon.payOneBond.currency)

  const couponPeriod = COUPON_PERIOD[coupon.couponPeriod] || ''
  return {
    figi: coupon.figi,
    couponPeriodNumber: coupon.couponPeriod,
    couponPeriod,
    couponEndDate: tranformDate(coupon.couponEndDate),
    payOneBond: getCoins(coupon.payOneBond?.units, coupon.payOneBond?.nano)
    // payOneBond: coupon.payOneBond?.units,
  };
};

// Нужен тест цены, чтобы четко соотвествовло рынку
export const _transformDataLastPrices = (lastPrice: TypesDataLastPrices) => {
  const testPrice = (+lastPrice.price.units + +lastPrice.price.nano / 1000000000) * 10
  const price = parseFloat(testPrice.toFixed(2))
  return {
    figi: lastPrice.figi,
    // price: getCoins(lastPrice.price?.units * 10, lastPrice.price?.nano),
    price: price,
    instrumentUid: lastPrice.instrumentUid,
    ticker: lastPrice.ticker
  }
}


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
    brand: bond.brand
  }
};
