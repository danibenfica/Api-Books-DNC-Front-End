const express = require('express')
const app = express();
const Livro = require('./models/livro.js')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection

db.on('error', (error) => console.error('Erro ao conectar ao banco de dados:', error))
db.once('open', () => console.log('Conectado ao banco de dados!'))

const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/livros', async (req, res) => {
  try {
    const livros = await Livro.find()
    res.json(livros)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
});

app.get('/livros/:id', async (req, res) => {
  const { id } = req.params

  try {
    const livro = await Livro.findById(id)

    if (!livro) {
      return res.status(404).json({ error: 'Livro não encontrado!' })
    }

    res.json(livro)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
});

app.post('/livros', async (req, res) => {
  const { _id, titulo, num_paginas, isbn, editora } = req.body

  const existingLivro = await Livro.findById(_id);
  if (existingLivro) {
    return res.status(400).json({ error: 'Esse ID já foi cadastrado!' })
  }

  const livro = new Livro({
    _id,
    titulo,
    num_paginas,
    isbn,
    editora,
  });

  try {
    const novoLivro = await livro.save()
    res.status(201).json(novoLivro)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
});

app.put('/livros/:id', async (req, res) => {
  const { id } = req.params

  try {
    const livro = await Livro.findByIdAndUpdate(id, req.body, { new: true })
    res.json(livro)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
});

app.delete('/livros/:id', async (req, res) => {
  const { id } = req.params

  try {
    const livro = await Livro.findByIdAndRemove(id)

    if (!livro) {
      return res.status(404).json({ error: 'Livro não encontrado!' })
    }

    res.status(200).json({
      message: 'Livro excluído com sucesso!',
      id: livro._id,
      titulo: livro.titulo
    })
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível excluir o livro!' })
  }
});


app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
});
