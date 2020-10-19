const BadRequest = require('../errors/badRequest');
const Article = require('../models/articleModel');
const ForbiddenError = require('../errors/forbidden');
const NotFoundError = require('../errors/notFound');

// получаем все статьи
const getArticles = (req, res, next) => Article.find({})
// populate() это метод Mongoose для замены идентификаторов объектами
  .populate('article')
  .then((articles) => res.status(200).send(articles))
  .catch(next);

// создаем статью в базе данных
const createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;

  Article.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .catch(() => {
      throw new BadRequest('Данные не валидны');
    })
    .then((article) => res.status(200).send({ article }))
    .catch(next);
};

// удаляем статью по id, оно берется из url
const deleteArticle = (req, res, next) => {
  const owner = req.user._id;
  Article.findOne({ _id: req.params.articleId }).select('+owner')
    .orFail()
    .catch(() => {
      throw new NotFoundError(`Статья с id - ${req.params.articleId} не найдена.`);
    })
    .then((article) => {
      if (String(article.owner) !== owner) throw new ForbiddenError('Недостаточно прав на удаление этой статьи.');
      return Article.deleteOne(article);
    })
    .then(() => res.send('Статья удалена из избранного.'))
    .catch(next);
};

module.exports = {
  getArticles, createArticle, deleteArticle,
};
