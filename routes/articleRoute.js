const routerArticles = require('express').Router();
const {
  getArticles, createArticle, deleteArticle,
} = require('../controllers/article');

// возвращает все сохранённые пользователем статьи
routerArticles.get('/', getArticles);

// создаёт статью с переданными в теле
// keyword, title, text, date, source, link и image
routerArticles.post('/', createArticle);

// ищет стотью по id и удаляет
routerArticles.delete('/:articleId', deleteArticle);

module.exports = routerArticles;
