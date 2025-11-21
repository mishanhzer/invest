require("dotenv").config();
const pMap = require("p-map");

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 3001;

const { TinkoffInvestApi } = require("tinkoff-invest-api"); // Импортируем SDK Тинькофф

const TOKEN = process.env.TINKOFF_API_TOKEN; // Токен из окружения

console.log(
  "Проверка токена при запуске:",
  TOKEN ? "Токен загружен успешно" : "ОШИБКА: Токен не найден"
);

if (!TOKEN) {
  console.error("API-токен не установлен!");
  process.exit(1); // что именно делает этот метод?
}

// Последние задачи по разбору кода
// 3. Разобраться и расписать как в 2025 году работать с асинхронными данными (где то нужна обработка цепочки. где то async await, try catch, Promise.all и т.д.)

// Задачи:
// 3. Настроить БД для хранения данных
// 4. Настроить Tanstack Query
// 5. Постараться вытащить данные по кредитным рейтингам АКРА Api
// 7. Посмотреть еще данные по облигациями, какие нам еще нужны

// Инициализируем клиент API
const api = new TinkoffInvestApi({ token: TOKEN });

// Middleware (позволяет React-приложению на другом порту делать запросы)
app.use(cors());
app.use(express.json()); // Для обработки JSON-запросов, если понадобятся POST запросы

// --- Определение маршрутов (ROUTES) ---
app.get("/", (req, res) => {
  res.send("<h1>сервер Node.js.</h1>");
});

const getConfig = (url, data) => {
  return {
    method: "post",
    maxBodyLength: Infinity,
    url, // Боевой URL API (не песочница)
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    data: data,
  };
};

// NODE_TLS_REJECT_UNAUTHORIZED=0 node server.js
app.get("/api/bonds-data", async (req, res) => {
  try {
    // 4. Запрос к API Тинькофф
    const bondsResponse = await api.instruments.bonds({});

    // 5. Форматируем и отправляем данные клиенту (React)
    const bonds = bondsResponse.instruments.map((b) => ({
      ticker: b.ticker,
      name: b.name,
      currency: b.currency,
      sector: b.sector,
      figi: b.figi,
      riskLevel: b.riskLevel,
      maturityDate: b.maturityDate, // Дата погашения облигации в часовом поясе UTC.
      nominal: b.nominal, // 	Номинал облигации.
      brand: b.brand,
      coupons: [],
      lastPrice: null,
    }));

    // const fetchCoupons = async (b) => {
    //   let data = {
    //     from: "2025-01-01T00:00:00Z",
    //     to: "2050-01-01T00:00:00Z",
    //     instrumentId: b.figi,
    //   };

    //   let config = {
    //     method: "post",
    //     maxBodyLength: Infinity,
    //     url: "https://invest-public-api.tbank.ru/rest/tinkoff.public.invest.api.contract.v1.InstrumentsService/GetBondCoupons", // Боевой URL API (не песочница)
    //     headers: {
    //       "Content-Type": "application/json",
    //       Accept: "application/json",
    //       Authorization: `Bearer ${TOKEN}`,
    //     },
    //     data: data,
    //   };
    //   try {
    //     const response = await axios.request(config);
    //     b.coupons = response.data.events || [];
    //   } catch (error) {
    //     (`Ошибка при запросе купонов для FIGI ${b.figi}:`,
    //       error.response ? error.response.data : error.message);
    //     b.coupons = [];
    //   }
    //   return b;
    // };

    // const fetchPrices = async (b) => {
    //   let data = {
    //     figi: [b.figi],
    //   };

    //   // 2. Подготовка конфигурации запроса
    //   let config = {
    //     method: "post",
    //     url: "https://invest-public-api.tbank.ru/rest/tinkoff.public.invest.api.contract.v1.MarketDataService/GetLastPrices",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Accept: "application/json",
    //       Authorization: `Bearer ${TOKEN}`,
    //     },
    //     data: data,
    //     responseType: "json",
    //   };

    //   try {
    //     const response = await axios.request(config);
    //     b.lastPrice = response.data || null;
    //   } catch (error) {
    //     (`Ошибка при запросе купонов для FIGI ${b.figi}:`,
    //       error.response ? error.response.data : error.message);
    //     b.lastPrice = null;
    //   }
    //   return b;
    // };

    // const resultsWithCoupons = await pMap.default(bonds, fetchCoupons, {
    //   concurrency: 5,
    // });

    // const resultsWithPrices = await pMap.default(
    //   resultsWithCoupons,
    //   fetchPrices,
    //   {
    //     concurrency: 5,
    //   }
    // );

    // await Promise.all(couponsPromises, lastPricesPromises);

    res.json(bonds);
    // res.json(resultsWithCoupons);
  } catch (error) {
    console.error("Ошибка при запросе к API Тинькофф:", error.message);
    res.status(500).json({
      message: "Не удалось получить данные об облигациях",
      error: error.message,
    });
  }
});

// Получение данных об облигациях (метод SDK работает корректно и почище axios)
app.get("/api/bonds", async (req, res) => {
  try {
    // 4. Запрос к API Тинькофф
    const bondsResponse = await api.instruments.bonds({});

    // 5. Форматируем и отправляем данные клиенту (React)
    const bonds = bondsResponse.instruments.map((b) => ({
      ticker: b.ticker,
      name: b.name,
      currency: b.currency,
      sector: b.sector,
      figi: b.figi,
      riskLevel: b.riskLevel,
      maturityDate: b.maturityDate, // Дата погашения облигации в часовом поясе UTC.
      nominal: b.nominal, // 	Номинал облигации.
      // brand: b.brand,
    }));

    res.json(bonds);
  } catch (error) {
    console.error("Ошибка при запросе к API Тинькофф:", error.message);
    res.status(500).json({
      message: "Не удалось получить данные об облигациях",
      error: error.message,
    });
  }
});

// // NODE_TLS_REJECT_UNAUTHORIZED=0 node server.js
// // Метод получения купонов по FIGI
// // TCS00A107D74
// app.get("/api/coupons/:figi", async (req, res) => {
//   try {
//     const { figi } = req.params; // Получаем FIGI из параметров URL

//     let data = {
//       from: "2025-01-01T00:00:00Z",
//       to: "2050-01-01T00:00:00Z",
//       instrumentId: figi,
//     };

//     // 2. Подготовка конфигурации запроса
//     let config = {
//       method: "post", // Метод getBondCoupons вызывается через POST
//       maxBodyLength: Infinity,
//       url: "https://invest-public-api.tbank.ru/rest/tinkoff.public.invest.api.contract.v1.InstrumentsService/GetBondCoupons", // Боевой URL API (не песочница)
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//         Authorization: `Bearer ${TOKEN}`,
//       },
//       data: data,
//     };

//     // 3. Выполнение запроса с помощью Axios
//     const response = await axios.request(config);

//     // 4. Отправка ответа клиенту (React)
//     res.json(response.data.events); // Отправляем только список событий купонов
//   } catch (error) {
//     console.error(
//       `Ошибка Axios при запросе купонов:`,
//       error.response ? error.response.data : error.message
//     );
//     res.status(500).json({
//       message: "Не удалось получить купонные выплаты через Axios",
//       error: error.response ? error.response.data : error.message,
//     });
//   }
// });

// // NODE_TLS_REJECT_UNAUTHORIZED=0 node server.js
// // BBG000B9XRY4
// // ISSUANCEPRLS
// // Метод получения последней цены облигации по FIGI
// app.get("/api/last-prices/:figi", async (req, res) => {
//   try {
//     const { figi } = req.params; // Получаем FIGI из параметров URL

//     // 1. Подготовка данных для запроса
//     let data = {
//       figi: [figi],
//     };

//     // 2. Подготовка конфигурации запроса
//     let config = {
//       method: "post",
//       url: "https://invest-public-api.tbank.ru/rest/tinkoff.public.invest.api.contract.v1.MarketDataService/GetLastPrices",
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//         Authorization: `Bearer ${TOKEN}`,
//       },
//       data: data,
//       responseType: "json",
//     };

//     // 3. Выполнение запроса с помощью Axios
//     const response = await axios.request(config);

//     res.json(response.data.lastPrices);
//     console.log("Информация об инструменте:", response.data);
//   } catch (error) {
//     console.error(
//       `Ошибка Axios при запросе последних цен:`,
//       error.response ? error.response.data : error.message
//     );
//     res.status(500).json({
//       message: "Не удалось получить последние цены через Axios",
//       error: error.response ? error.response.data : error.message,
//     });
//   }
// });

// --- Запуск сервера ---
app.listen(PORT, () => {
  console.log(`Сервер запущен и слушает порт: http://localhost:${PORT}`);
});

// ------------------------------------------------------------------------------------------------------------
// Тестовый код
// NODE_TLS_REJECT_UNAUTHORIZED=0 node server.js

// Функция для получения всех FIGI
// const getAllFigi = async (apiClient) => {
//   try {
//     const bondsResponse = await apiClient.instruments.bonds({});
//     const figiString = bondsResponse.instruments.map((b) => b.figi);
//     return figiString;
//   } catch (error) {
//     console.error("Ошибка: ", error.messae);
//     console.error("Ошибка в функции getAllFigi:", error.message);
//     throw new Error("Не удалось получить список FIGI из API Тинькофф");
//   }
// };

// Метод получения всех FIGI
// app.get("/api/figi-all", async (req, res) => {
//   try {
//     const figi = await getAllFigi(api);
//     res.json(figi);
//   } catch (error) {
//     console.error("Ошибка при запросе к API Тинькофф:", error.message);
//     res.status(500).json({
//       message: "Не удалось получить данные об облигациях",
//       error: error.message,
//     });
//   }
// });

// Отложенные задачи:
// 1. Настроить сертификат, чтобы не вызывать сервер так NODE_TLS_REJECT_UNAUTHORIZED=0 node server.js - это не безопасно в продакшене (настроить, когда буду выводить в продакшен)

// Метод на получение списка акций (пока не нужен)
// app.get("/api/stocks", async (req, res) => {
//   try {
//     // 4. Запрос к API Тинькофф
//     const sharesResponse = await api.instruments.shares({});

//     // 5. Форматируем и отправляем данные клиенту (React)
//     const stocks = sharesResponse.instruments.map((s) => ({
//       ticker: s.ticker,
//       name: s.name,
//       currency: s.currency,
//       figi: s.figi,
//     }));

//     res.json(stocks); // переводим ответ в обьект или в обьект JSON?
//   } catch (error) {
//     // Обработка ошибок (например, неверный токен)
//     // Зачем тут две строчки?
//     console.error("Ошибка при запросе к API Тинькофф:", error.message);
//     res.status(500).json({
//       // что делает эта строчка?
//       message: "Не удалось получить данные об акциях",
//       error: error.message,
//     });
//   }
// });

// Тестовый метод получения всех последний цен
// app.get("/api/last-prices/", async (req, res) => {
//   try {
//     // 2. Подготовка конфигурации запроса
//     let config = {
//       method: "post",
//       url: "https://invest-public-api.tbank.ru/rest/tinkoff.public.invest.api.contract.v1.MarketDataService/GetLastPrices",
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//         Authorization: `Bearer ${TOKEN}`,
//       },
//       data: {},
//       responseType: "json",
//     };

//     // 3. Выполнение запроса с помощью Axios
//     const response = await axios.request(config);

//     res.json(response.data.lastPrices);
//     console.log("Информация об инструменте:", response.data);
//   } catch (error) {
//     console.error(
//       `Ошибка Axios при запросе последних цен:`,
//       error.response ? error.response.data : error.message
//     );
//     res.status(500).json({
//       message: "Не удалось получить последние цены через Axios",
//       error: error.response ? error.response.data : error.message,
//     });
//   }
// });

// Функция для стоп запроса, чтобы не превышать лимит
// function sleep(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// Метод получения купонов всех облигаций
// app.get("/api/coupons/", async (req, res) => {
//   try {
//     const allFigi = await getAllFigi(api);
//     console.log(`Получено ${allFigi.length} FIGI для обработки.`);

//     const allCoupons = []; // Массив для сбора всех купонов

//     for (const figi of allFigi) {
//       try {
//         let data = {
//           from: "2025-01-01T00:00:00Z",
//           to: "2050-01-01T00:00:00Z",
//           instrumentId: figi,
//         };

//         let config = {
//           method: "post",
//           url: "https://invest-public-api.tbank.ru/rest/tinkoff.public.invest.api.contract.v1.InstrumentsService/GetBondCoupons",
//           headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//             Authorization: `Bearer ${TOKEN}`,
//           },
//           data: data,
//         };

//         const response = await axios.request(config);

//         allCoupons.push(...response.data.events);

//         await sleep(400);
//       } catch (error) {
//         console.error(
//           `Ошибка при получении купонов для FIGI ${figi}:`,
//           error.message
//         );
//         await sleep(1000);
//       }
//     }

//     console.log(
//       `Обработка завершена. Всего собрано купонов: ${allCoupons.length}`
//     );

//     res.json(allCoupons); // Отправляем собранные данные клиенту
//   } catch (error) {
//     // Этот catch поймает ошибки, не связанные с отдельными запросами (например, getAllFigi)
//     console.error(
//       `Критическая ошибка в маршруте /api/coupons/:`,
//       error.message
//     );
//     res.status(500).json({
//       message: "Критическая ошибка сервера при обработке купонов",
//       error: error.message || String(error),
//     });
//   }
// });
