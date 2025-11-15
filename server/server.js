require("dotenv").config();

const express = require("express"); // подключение фреймворка express
const cors = require("cors"); // Пока оставим CORS, чтобы потом было проще подключать React
const axios = require("axios"); // Подключение библиотеки axios

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

// Задачи:
// 3. Настроить БД для хранения данных
// 4. Настроить Tanstack Query
// 5. Постараться вытащить данные по кредитным рейтингам АКРА Api
// 6. Подгрузить картинки облигаций
// 7. Посмотреть еще данные по облигациями, какие нам еще нужны

// Какие данные нам нужно получить от API:
// Цена бумаги на текущий момент

// Инициализируем клиент API
const api = new TinkoffInvestApi({ token: TOKEN });

// Middleware (позволяет React-приложению на другом порту делать запросы)
app.use(cors());
app.use(express.json()); // Для обработки JSON-запросов, если понадобятся POST запросы

// --- Определение маршрутов (ROUTES) ---
// Маршрут 1: Главная страница (http://localhost:3001/)
app.get("/", (req, res) => {
  res.send("<h1>сервер Node.js.</h1>");
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
      brand: b.brand,

      // initialNominal: b.initialNominal, // 	Первоначальный номинал облигации.
      // aciValue: b.aciValue, // размер накопленного дохода
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

// NODE_TLS_REJECT_UNAUTHORIZED=0 node server.js
// Метод получения купонов
// TCS00A107D74
app.get("/api/coupons/:figi", async (req, res) => {
  try {
    const { figi } = req.params; // Получаем FIGI из параметров URL

    let data = {
      from: "2025-01-01T00:00:00Z",
      to: "2050-01-01T00:00:00Z",
      instrumentId: figi,
    };

    // 2. Подготовка конфигурации запроса
    let config = {
      method: "post", // Метод getBondCoupons вызывается через POST
      maxBodyLength: Infinity,
      url: "https://invest-public-api.tbank.ru/rest/tinkoff.public.invest.api.contract.v1.InstrumentsService/GetBondCoupons", // Боевой URL API (не песочница)
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      data: data,
    };

    // 3. Выполнение запроса с помощью Axios
    const response = await axios.request(config);

    // 4. Отправка ответа клиенту (React)
    res.json(response.data.events); // Отправляем только список событий купонов
  } catch (error) {
    console.error(
      `Ошибка Axios при запросе купонов:`,
      error.response ? error.response.data : error.message
    );
    res.status(500).json({
      message: "Не удалось получить купонные выплаты через Axios",
      error: error.response ? error.response.data : error.message,
    });
  }
});

const allFigi = ["TCS00A107D74", "BBG00XH4W3N3", "BBG00Z8KGGC3"];

// Разобрать этот метод подробно
app.get("/api/coupons/", async (req, res) => {
  try {
    // 1. Создаем массив промисов (запросов)
    const requests = allFigi.map((figi) => {
      let data = {
        from: "2025-01-01T00:00:00Z",
        to: "2050-01-01T00:00:00Z",
        instrumentId: figi, // <-- Здесь используется ОДИН FIGI для ОДНОГО запроса
      };

      let config = {
        method: "post",
        url: "https://invest-public-api.tbank.ru/rest/tinkoff.public.invest.api.contract.v1.InstrumentsService/GetBondCoupons",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        data: data,
      };

      return axios.request(config);
    });

    const responses = await Promise.all(requests);

    const allCoupons = responses.flatMap((response) => response.data.events);

    res.json(allCoupons);
  } catch (error) {
    console.error(
      `Ошибка Axios при запросе купонов:`,
      error.response
        ? JSON.stringify(error.response.data, null, 2)
        : error.message
    );
    res.status(500).json({
      message: "Не удалось получить купонные выплаты через Axios",
      error: error.response ? error.response.data : error.message,
    });
  }
});

// NODE_TLS_REJECT_UNAUTHORIZED=0 node server.js
// BBG000B9XRY4
// ISSUANCEPRLS
// TCS00A105WR1
// BBG00XH4W3N3

// RU000A107D74
// RU000A101RZ3
app.get("/api/last-prices/:figi", async (req, res) => {
  try {
    const { figi } = req.params; // Получаем FIGI из параметров URL

    // 1. Подготовка данных для запроса
    let data = {
      figi: [figi],
    };

    // 2. Подготовка конфигурации запроса
    let config = {
      method: "post",
      url: "https://invest-public-api.tbank.ru/rest/tinkoff.public.invest.api.contract.v1.MarketDataService/GetLastPrices",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      data: data,
      responseType: "json",
    };

    // 3. Выполнение запроса с помощью Axios
    const response = await axios.request(config);

    res.json(response.data.lastPrices);
    console.log("Информация об инструменте:", response.data);
  } catch (error) {
    console.error(
      `Ошибка Axios при запросе последних цен:`,
      error.response ? error.response.data : error.message
    );
    res.status(500).json({
      message: "Не удалось получить последние цены через Axios",
      error: error.response ? error.response.data : error.message,
    });
  }
});

// Тестовый метод получения всех последний цен
app.get("/api/last-prices/", async (req, res) => {
  try {
    // 2. Подготовка конфигурации запроса
    let config = {
      method: "post",
      url: "https://invest-public-api.tbank.ru/rest/tinkoff.public.invest.api.contract.v1.MarketDataService/GetLastPrices",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      data: {},
      responseType: "json",
    };

    // 3. Выполнение запроса с помощью Axios
    const response = await axios.request(config);

    res.json(response.data.lastPrices);
    console.log("Информация об инструменте:", response.data);
  } catch (error) {
    console.error(
      `Ошибка Axios при запросе последних цен:`,
      error.response ? error.response.data : error.message
    );
    res.status(500).json({
      message: "Не удалось получить последние цены через Axios",
      error: error.response ? error.response.data : error.message,
    });
  }
});

// --- Запуск сервера ---
app.listen(PORT, () => {
  console.log(`Сервер запущен и слушает порт: http://localhost:${PORT}`);
});

// Отложенные задачи:
// 1. Настроить сертификат, чтобы не вызывать сервер так NODE_TLS_REJECT_UNAUTHORIZED=0 node server.js - это не безопасно в продакшене (настроить, когда буду выводить в продакшен)

// Метод на получение списка акций (пока не нужен)
// Default node.js
// Что лучше использовать этот метод или лучше работать через axios?
// Маршрут для получения списка акций (http://localhost:3001/api/stocks)
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
