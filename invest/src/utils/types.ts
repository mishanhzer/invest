// Типы купонов
interface TypesPayOneBond {
  currency: string
  nano: number
  units: string
}

export type TypesCoupons = {
  figi: string
  couponPeriod: number
  couponEndDate: string
  payOneBond: TypesPayOneBond
};

// Типы облигаций
interface TypesNominal {
  units: string
  currency: string
}

interface TypesBrand {
  logoBaseColor: string
  logoName: string
  textColor: string
}

export interface TypesBonds {
  figi: string
  maturityDate: string
  name: string
  nominal: TypesNominal
  riskLevel: number
  sector: string
  ticker: string
  brand: TypesBrand
}

interface TypesPrice {
  units: string
  nano: number
}

export interface TypesDataLastPrices {
  classCode: string
  figi: string
  instrumentUid: string
  lastPricesType: string
  price: TypesPrice
  ticker: string
  time: string
}

export interface TypesSectorsBonds {
  [key: string]: string
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
}

export interface TypesCurrencySybmol {
  [key: string]: string
  rub: '₽'
  usd: '$'
  eur: '€'
  cny: 'CNY'
  chf: 'CHF'
}

// Типы настроек для трансформации даты
export interface TypesOptions {
  day: 'numeric'
  month: 'long' 
  year: 'numeric'
}

export interface TypesCouponPeriod {
  [key: number]: string
  365: '1 раз в год'
  182: '1 раз в полгода'
  91: '4 раза в год'
  30: '1 раз в месяц'
}
