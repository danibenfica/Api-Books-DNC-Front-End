const mongoose = require('mongoose');

const livroSchema = new mongoose.Schema({
  _id: {
    type: String,
    auto: false, 
  },
  titulo: String,
  num_paginas: Number,
  isbn: String,
  editora: String,
});


module.exports = mongoose.model('Livro', livroSchema);
