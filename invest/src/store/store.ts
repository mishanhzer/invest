import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, devtools, createJSONStorage } from "zustand/middleware"; // для связи с localStorage

import axios from "axios";

import type {TypesStore} from './types'

export const useStore = create<TypesStore>()(
  devtools(
 persist(
  immer(
    (set) => ({
      dataBonds: [],
      dataCoupons: [],
      dataCommon: [],

      dataPrice: [],
      setDataPrice: (dataPrice) => {
        set({dataPrice})
      },
      
      setDataBonds: (dataBonds) => (
        set({dataBonds})
      ),
      setDataCoupons: (dataCoupons) => {
        set({dataCoupons})
      },

      setConcatData: (dataBonds, dataCoupons, dataPrice) => {
        const dataCommon = dataBonds.filter(bond => dataCoupons.find(coupon => bond.figi === coupon.figi))
        .map(bond => {
          const couponWithRate =
            dataCoupons.filter(coupon => bond.figi === coupon.figi)
              .map(coupon => {
                const rateData = (coupon.payOneBond / 1000) * (365 / coupon.couponPeriodNumber) * 100
                const rate = Math.round((rateData + Number.EPSILON) * 100) / 100
                return { ...coupon, rate }
              })
          const price = dataPrice.find(price => bond.figi === price.figi)?.price
          return { ...bond, couponWithRate, price }
        })
        
        set({dataCommon})
      }

    }),
  ), {
    name: 'main-storage',
    // storage: createJSONStorage(() => localStorage)
  }
 )
  )
);