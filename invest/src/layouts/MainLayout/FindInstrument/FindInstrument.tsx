import { useState, useEffect, useRef } from 'react'

import { useStore } from '../../../store/store'

import styles from './findInstrument.module.scss'

export const FindInstrument = () => {
  const dataBonds = useStore(state => state.dataBonds)

  const [query, setQuery] = useState('') // поле ввода инпута
  console.log(query)
  const [showList, setShowList] = useState(false)
  const [data, setData] = useState([])


  const filteredData = (data, query) => {
    return data.filter(bond => bond.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
  }
  console.log(filteredData(dataBonds, query))

  const handleInputChange = (e) => {
    setQuery(e.target.value)
  }

  return (
    <div className={styles.container}>
      <input
        type='text'
        className={styles.finder}
        onChange={handleInputChange}
        value={query}
        placeholder='Название или тикер' />
    </div>
  )
}