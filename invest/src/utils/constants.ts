import type { TypesSectorsBonds, TypesCurrencySybmol, TypesCouponPeriod } from "./types";

export const SECTOR_BONDS: TypesSectorsBonds = {
  consumer: 'Потребительский',
  energy: 'Энергетический',
  financial: 'Финансовый',
  government: 'Государственный',
  health_care: 'Здравоохранение',
  industrials: 'Промышленный',
  it: 'Информационные технологии',
  materials: 'Сырьевой',
  municipal: 'Муниципальный',
  other: 'Другой',
  real_estate: 'Недвижимость',
  telecom: 'Телекоммуникационный',
  utilities: 'Коммунальные услуги',
};

export const CURRENCY_SYMBOLS: TypesCurrencySybmol = {
  rub: '₽',
  usd: '$',
  eur: '€',
  cny: 'CNY',
  chf: 'CHF'
}

export const COUPON_PERIOD: TypesCouponPeriod = {
  365: '1 раз в год',
  182: '1 раз в полгода',
  91: '4 раза в год',
  30: '1 раз в месяц'
}

