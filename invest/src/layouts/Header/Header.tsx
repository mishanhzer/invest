import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query';

import { useStore } from '../../store/store'

import { request } from '../../hooks/http.hook';
import { _transformDataCoupons, _transformDataBonds } from '../../utils/transformData'

import styles from './header.module.scss'

// Задачи:
// 1. Посмотреть как можно еще отпимизировать Tanstack query
// 2. Разобрать код подробнее

export const Header = () => {
  const setDataBonds = useStore(state => state.setDataBonds)
  const setDataCoupons = useStore(state => state.setDataCoupons)

  const setConcatData = useStore(state => state.setConcatData)
  const dataCommon = useStore(state => state.dataCommon)
  // console.log(dataCommon)

  // useEffect(() => {
  //   Promise.all([
  //     request('/dataCoupons.json').then(item => item.map(_transformDataCoupons)),
  //     request('/dataBonds.json').then(item => item.map(_transformDataBonds))])
  //     .then(([transformedCoupons, transformedBonds]) => {
  //       setDataCoupons(transformedCoupons)
  //       setDataBonds(transformedBonds)
  //       setConcatData(dataBonds, dataCoupons)
  //     })
  //     .catch(error => {
  //       console.log('Ошибка загрузки:', error)
  //     })
  // }, [request])


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
      const data = await request('/dataBonds.json')
      return data.map(_transformDataBonds)
    }
  })

  useEffect(() => {
    if (!couponsQuery.isLoading && !bondsQuery.isLoading && couponsQuery.data && bondsQuery.data) {
      setDataBonds(bondsQuery.data)
      setDataCoupons(couponsQuery.data)
      setConcatData(bondsQuery.data, couponsQuery.data)
    }
  }, [
    couponsQuery.isLoading,
    bondsQuery.isLoading,
    couponsQuery.data,
    bondsQuery.data,
    setDataCoupons,
    setDataBonds,
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
