require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NotFoundError = require('../errors/notFound');
const EmailError = require('../errors/emailErr');
const BadRequest = require('../errors/badRequest');
const User = require('../models/userModel');

const { NODE_ENV, JWT_SECRET } = process.env;
// регистрация пользователя
const registerUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash }))
    .catch((err) => {
      if (err.code === 11000) {
        throw new EmailError('Пользователь с таким email уже существует');
      } else if (err.name === 'validatorError') {
        throw new BadRequest('Данные не прошли валидацию');
      } else {
        next(err);
      }
    })
    .then((user) => res.status(201).send({
      name: user.name,
      email: user.email,
    }))
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .catch(() => {
      throw new EmailError('Пользователь с таким email не найден');
    })
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь не найден');
      res.send({
        email: user.email,
        name: user.name,
      });
    })
    .catch(next);
};

module.exports = {
  registerUser, login, getUser,
};
