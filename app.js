const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
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
app.use(cors());
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
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), registerUser);
// логин, получение токена
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.use(auth);
// подключаем роут со статьями
app.use('/articles', require('./routes/articleRoute'));
// возвращает текущего залогиненого пользователя
app.use('/users', require('./routes/userRoute'));

app.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});
// собирает ошибки в логгер
app.use(errorLogger);
// собирает ошибки валидации
app.use(errors());
// здесь обрабатываем все ошибки
app.use(errorHandler);

// начинаем прослушивать подключения на PORT
app.listen(PORT, () => {
});
