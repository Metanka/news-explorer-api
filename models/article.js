/* eslint-disable import/no-unresolved */
const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  sourse: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        // eslint-disable-next-line no-useless-escape
        return /^((http|https)\:\/\/)(www\.)?([a-zA-Z0-9\-]{0,50}\.?){1,5}\/?([a-zA-Z0-9\=\?\.\-\#\/]{0,50}){0,50}?\.?$/.test(v);
      },
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        // eslint-disable-next-line no-useless-escape
        return /^((http|https)\:\/\/)(www\.)?([a-zA-Z0-9\-]{0,50}\.?){1,5}\/?([a-zA-Z0-9\=\?\.\-\#\/]{0,50}){0,50}?\.?$/.test(v);
      },
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'article',
  },
});

module.exports = mongoose.model('articles', articleSchema);
