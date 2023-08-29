import { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import "./index.scss";
import SubmenuLivros from '../../components/SubmenuLivros/SubmenuLivros';
import { LivrosService } from '../../api/LivrosService';

const LivrosCadastro = () => {
  const [livro, setLivro] = useState({
    _id: '',
    titulo: '',
    num_paginas: '',
    isbn: '',
    editora: ''
  });
  const [mensagemErro, setMensagemErro] = useState('');
  const [livrosExistem, setLivrosExistem] = useState([]);

  useEffect(() => {
    async function fetchLivros() {
      try {
        const response = await LivrosService.getLivros();
        const livros = response.data;
        const ids = livros.map(livro => livro._id);
        setLivrosExistem(ids);
      } catch (error) {
        console.error('Erro ao buscar livros:', error);
      }
    }
    fetchLivros();
  }, []);

  async function createLivro() {
    const novoLivro = {
      _id: Number(livro._id),
      titulo: livro.titulo,
      num_paginas: Number(livro.num_paginas),
      isbn: livro.isbn,
      editora: livro.editora
    };

    if (
      !livro._id ||
      !livro.titulo ||
      !livro.num_paginas ||
      !livro.isbn ||
      !livro.editora
    ) {
      setMensagemErro('Por favor, preencha todos os campos.');
      return;
    }

    if (livrosExistem.includes(novoLivro._id)) {
      setMensagemErro('Livro com o mesmo ID já cadastrado.');
      return;
    }

    try {
      await LivrosService.createLivro(novoLivro);
      alert('Livro cadastrado com sucesso!');
      setLivro({
        _id: '',
        titulo: '',
        num_paginas: '',
        isbn: '',
        editora: ''
      });
      setMensagemErro('');
    } catch (error) {
      setMensagemErro('Erro ao criar o livro.');
      console.error('Erro ao criar o livro:', error);
    }
  }

  return (
    <>
      <Header />
      <SubmenuLivros />
      <div className='livrosCadastro'>
        <h1>Cadastro de Livros</h1>
        <div>
          <form>
            <div className='form-group'>
              <label>Id</label>
              <input
                type="text"
                id='id'
                required
                value={livro._id}
                onChange={(event) => {
                  setLivro({ ...livro, _id: event.target.value });
                }}
              ></input>
            </div>
            <div className='form-group'>
              <label>Titulo</label>
              <input
                type="text"
                id='titulo'
                required
                value={livro.titulo}
                onChange={(event) => {
                  setLivro({ ...livro, titulo: event.target.value });
                }}
              ></input>
            </div>
            <div className='form-group'>
              <label>Número de Páginas</label>
              <input
                type="number"
                id='num'
                required
                value={livro.num_paginas}
                onChange={(event) => {
                  setLivro({ ...livro, num_paginas: event.target.value });
                }}
              ></input>
            </div>
            <div className='form-group'>
              <label>ISBN</label>
              <input
                type="text"
                id='isbn'
                required
                value={livro.isbn}
                onChange={(event) => {
                  setLivro({ ...livro, isbn: event.target.value });
                }}
              ></input>
            </div>
            <div className='form-group'>
              <label>Editora</label>
              <input
                type="text"
                id='editora'
                required
                value={livro.editora}
                onChange={(event) => {
                  setLivro({ ...livro, editora: event.target.value });
                }}
              ></input>
            </div>
            <div className='form-group'>
              {mensagemErro && <div className="error-message">{mensagemErro}</div>}
              <button
                type="button"
                onClick={() => {
                  createLivro();
                }}
              >
                Cadastrar Livro
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LivrosCadastro;
