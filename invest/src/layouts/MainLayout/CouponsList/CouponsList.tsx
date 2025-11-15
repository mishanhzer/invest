import styles from './couponsList.module.scss'

export const CouponsList = ({ data }) => {
  console.log(data)
  return (
    <div className={styles.container}>
      <div className={styles.calendar}>Календарь купонов</div>
      <div className={styles.headersCalendar}>
        <div>Дата</div>
        <div>Купон</div>
        <div>Ставка</div>
      </div>

      <div className={styles.coupons}>
        {data.map(item => {
          return item.couponWithRate.map(item => {
            return (
              <div className={styles.couponStyle}>
                <div>{item.couponEndDate}</div>
                <div>{item.payOneBond} ₽</div>
                <div>{item.rate} ﹪</div>
              </div>
            )
          })
        })}
      </div>
    </div>
  )
}