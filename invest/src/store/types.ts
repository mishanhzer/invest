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

interface TypesRate extends TypesDataCoupons {
  rate: number
}

interface TypesDataCommon extends TypesDataBonds{
  couponsWithRate?: TypesRate[]
}
export interface TypesStore {
  dataBonds: TypesDataBonds[]
  dataCoupons: TypesDataCoupons[]
  dataCommon: TypesDataCommon[]

  setDataBonds: (dataBonds: TypesDataBonds[]) => void
  setDataCoupons: (dataCoupons: TypesDataCoupons[]) => void
  setConcatData: (dataBonds: TypesDataBonds[], dataCoupons: TypesDataCoupons[]) => void
}