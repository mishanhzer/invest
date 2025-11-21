interface TypesDataBonds {
  figi: string
  maturityDate: string
  name: string
  nominal: number
  riskLevel: number
  sector: string
  ticker: string
}

interface TypesDataCoupons {
  couponEndDate: string
  couponPeriod: string
  couponPeriodNumber: number
  figi: string
  payOneBond: number
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

interface TypesRate extends TypesDataCoupons {
  rate: number
}

interface TypesDataCommon extends TypesDataBonds {
  couponsWithRate?: TypesRate[]
  price?: TypesPrice
}
export interface TypesStore {
  dataBonds: TypesDataBonds[]
  dataCoupons: TypesDataCoupons[]
  dataCommon: TypesDataCommon[]
  dataPrice: TypesDataLastPrices[]

  setDataBonds: (dataBonds: TypesDataBonds[]) => void
  setDataCoupons: (dataCoupons: TypesDataCoupons[]) => void
  setDataPrice: (dataPrice: TypesDataLastPrices[]) => void
  setConcatData: (dataBonds: TypesDataBonds[], dataCoupons: TypesDataCoupons[], dataPrice: TypesDataLastPrices[]) => void
}