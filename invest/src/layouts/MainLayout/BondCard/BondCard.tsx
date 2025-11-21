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
        <div className={styles.container} key={item.figi}>
          <div className={styles.header}>
            <div>
              <div className={styles.nameBond}>{item.name}</div>
              <div className={styles.ticker}>{item.ticker}</div>
            </div>
            <div className={styles.headerTop}>
              <div>{item.price}</div>
              <div>increase</div>
              <div>{item.nominal} ₽</div>
            </div>

            <div className={styles.navigate}>
              <div>Детали</div>
              <div>Купоны</div>
            </div>
          </div>

          <CouponsList data={dataCommon} key={item.figi} />
        </div>
      )
    })

  )
}