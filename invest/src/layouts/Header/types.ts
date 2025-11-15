interface TypesPayOneBond {
  currency: string
  nano: number
  units: string
}

export interface TypesDataCoupons {
  couponDate?: string
  couponEndDate?: string
  couponNumber?: string
  couponPeriod?: string
  couponStartDate?: string
  figi?: string
  fixDate?: string
  payOneBond?: string | TypesPayOneBond
}

interface TypesNominal {
  units: string
  currency: string
}

export interface TypesDataBonds {
  figi: string
  maturityDate: string
  name: string
  nominal: TypesNominal
  riskLevel: number
  sector: string
  ticker: string
}