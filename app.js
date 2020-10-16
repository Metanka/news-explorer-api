const express = require('express');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { registerUser, login } = require('./controllers/user');
const NotFoundError = require('./errors/notFound');

// состояние окружения системы в момент запуска приложения
const { PORT = 3000 } = process.env;
// создаем объект приложения
const app = express();
const mongoDB = 'mongodb://localhost:27017/searcher';
// Установим подключение по умолчанию
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true,
  useUnifiedTopology: true,
});

// подключаем логгер запросов
app.use(requestLogger);

// для получения отправленных данных необходимо создать парсер
app.use(bodyParser.json());
// extended: true указывает, что req.body будет содержать значения любого типа, не только строки.
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сейчас сервер упадет');
  }, 0);
});
// регистрация пользователя
app.post('/signup', registerUser);
// логин, получение токена
app.post('/signin', login);
app.use(auth);
// подключаем роут со статьями
app.use('/articles', require('./routes/articleRoute'));
// возвращает текущего залогиненого пользователя
app.use('/users', require('./routes/userRoute'));

app.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use(errorLogger);

// здесь обрабатываем все ошибки
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
    });
});

// начинаем прослушивать подключения на PORT
app.listen(PORT, () => {
});
