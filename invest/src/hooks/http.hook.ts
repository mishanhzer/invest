// t.Squ0XeFdObwLdR56y3pJJf-d3-02aEuskq8D4s3k9vuKjQjMX1XFECFfxhCfZOw-Z4Ff_UbFr0AuXzkX2EjXPg (Внимание! Зная этот токен, можно узнать баланс вашего портфеля и его состав, но нельзя создавать торговые поручения.)

// t.JmDa1D7fFBIm0bYWahRzV3kzj6mhXgJIAYY3olNdUNBWc0kqGP8pM6ZQTy6KxiCr3-9CW1tyQ-Kj_HTKuotErg (токен для боевой версии - море)

// t.qipsm2x05gI4Rmsl66Jesp4te9HmBF71nfVYXPrr18AfaXXh4-m1Ej6PFHkapoRiolyO3801-lwNwDN7DPV1Iw (токен для песочницы)

// import { useCallback } from "react";
import axios from "axios";

// // Функция для обработки GET запроса
export const request = async (url: string) => {
  const response = await axios.get(url)
  return response.data
}

// При использовании Tanstack query обработка ошибок не нужно (она автоматически внутри библиотеки)
// export const useHttp = () => {
//   const request = useCallback(async (
//     url: string) => {
//     try {
//       const response = await axios.get(url);
//       return response.data 
//     }
//       catch (error) {
//       if (axios.isAxiosError(error)) {
//         throw new Error(
//           `Could not fetch ${url}, status: ${error.response?.status ?? 'unknown'}`
//         );
//       }
//       throw error;
//     }
//     }, [])

//     return {request} 
// }

// Универсальный метод под все методы
// export const useHttp = () => {
//   const request = useCallback(async (
//     url: string, 
//     method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', 
//     body = null, 
//     headers = {'Content-Type': 'application/json', Authorization: null}) => {
//     try {
//       const config = {
//         method,
//         url,
//         data: body,
//         headers
//       };

//       const response = await axios(config);
//       return response.data 
//     }
//       catch (error) {
//       if (axios.isAxiosError(error)) {
//         throw new Error(
//           `Could not fetch ${url}, status: ${error.response?.status ?? 'unknown'}`
//         );
//       }
//       throw error;
//     }
//     }, [])

//     return {request} 
// }

