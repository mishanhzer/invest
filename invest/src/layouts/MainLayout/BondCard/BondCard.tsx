import { useState } from 'react'
import { CouponsList } from '../CouponsList/CouponsList'
import { useStore } from '../../../store/store'

import styles from './bondCard.module.scss'

export const BondCard = () => {
  const dataCommon = useStore(state => state.dataCommon)

  console.log(dataCommon)
  return (
    dataCommon.map(item => {
      return (
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.nameBond}>{item.name}</div>
            <div className={styles.headerTop}>
              <div>currentSum</div>
              <div>increase</div>
              <div>{item.nominal} ₽</div>
            </div>

            <div className={styles.navigate}>
              <div>Детали</div>
              <div>Купоны</div>
            </div>
          </div>

          <CouponsList data={dataCommon} />
        </div>
      )
    })

  )
}