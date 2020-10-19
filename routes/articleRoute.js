const routerArticles = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getArticles, createArticle, deleteArticle,
} = require('../controllers/article');

// возвращает все сохранённые пользователем статьи
routerArticles.get('/', getArticles);

// создаёт статью с переданными в теле
// keyword, title, text, date, source, link и image
routerArticles.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().pattern(/^((http|https):\/\/)(www\.)?([a-zA-z0-9.-]+)\.([a-zA-z]+)([a-zA-z0-9%$?/.-]+)?(#)?$/),
    image: Joi.string().required().pattern(/^((http|https):\/\/)(www\.)?([a-zA-z0-9.-]+)\.([a-zA-z]+)([a-zA-z0-9%$?/.-]+)?(#)?$/),
  }),
}), createArticle);

// ищет стотью по id и удаляет
routerArticles.delete('/:articleId', celebrate({
  body: Joi.object().keys({
    _id: Joi.string().alphanum().hex(),
  }),
}), deleteArticle);

module.exports = routerArticles;
