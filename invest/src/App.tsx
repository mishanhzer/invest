import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './queryClient.js'

import { Header } from "./layouts/Header/Header"


import { BondCard } from './layouts/MainLayout/BondCard/BondCard.js'

import styles from './app.module.scss'

// Необходимо установить react router
// Сначала нужно получить все данные на бэк, затем вывести их на фронт, а потом уже строить верстку

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className={styles.app}>
        <div className={styles.content}>
          <Header />

          <BondCard />
        </div>
      </div>
    </QueryClientProvider>
  )
}

export default App
