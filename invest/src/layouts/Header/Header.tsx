import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query';

import { useStore } from '../../store/store'

import { request } from '../../hooks/http.hook';
import { _transformDataCoupons, _transformDataBonds, _transformDataLastPrices } from '../../utils/transformData'

import styles from './header.module.scss'

// Задачи:
// 1. Посмотреть как можно еще отпимизировать Tanstack query
// 2. Разобрать код подробнее

export const Header = () => {
  const setDataBonds = useStore(state => state.setDataBonds)
  const setDataCoupons = useStore(state => state.setDataCoupons)
  const setDataPrice = useStore(state => state.setDataPrice)

  const setConcatData = useStore(state => state.setConcatData)

  const couponsQuery = useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      const data = await request('/dataCoupons.json')
      return data.map(_transformDataCoupons)
    }
  })

  const bondsQuery = useQuery({
    queryKey: ['bonds'],
    queryFn: async () => {
      // const data = await request('/dataBonds.json')
      const data = await request('http://localhost:3001/api/bonds/')
      return data.map(_transformDataBonds)
    }
  })

  // TCS00A104XR2
  const priceQuery = useQuery({
    queryKey: ['price'],
    queryFn: async () => {
      const data = await request('/dataLast.json')
      return data.map(_transformDataLastPrices)
    }
  })

  useEffect(() => {
    if (!couponsQuery.isLoading && !bondsQuery.isLoading && couponsQuery.data && bondsQuery.data) {
      setDataBonds(bondsQuery.data)
      setDataCoupons(couponsQuery.data)
      setDataPrice(priceQuery.data)

      setConcatData(bondsQuery.data, couponsQuery.data, priceQuery.data)
    }
  }, [
    couponsQuery.isLoading,
    bondsQuery.isLoading,
    couponsQuery.data,
    bondsQuery.data,
    priceQuery.data,
    setDataCoupons,
    setDataBonds,
    setDataPrice,
    setConcatData,
  ])

  if (bondsQuery.isLoading || couponsQuery.isLoading) {
    return <div>Загрузка</div>
  }

  if (bondsQuery.isError || couponsQuery.isError) {
    return (
      <div>
        Ошибка: {bondsQuery.error?.message || couponsQuery.error?.message}
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div>Input data</div>
      <div>Info bonds</div>
      <div>Chart</div>
      <div>Info coupons salary</div>
      <div>Advanced Info</div>
    </div>
  )
}
