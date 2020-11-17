const routeUsers = require('express').Router();
const {
  getUser,
} = require('../controllers/user');

// возвращает текущего залогиненого пользователя
routeUsers.get('/me', getUser);

module.exports = routeUsers;
