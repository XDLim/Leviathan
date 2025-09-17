const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 3000;


require('dotenv').config();

// ...
// Conectando ao MongoDB Atlas usando variáveis de ambiente
const MONGODB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@leviatham.ezdx4rl.mongodb.net/?retryWrites=true&w=majority&appName=Leviatham`;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Conectado ao MongoDB Atlas!');
}).catch(err => {
  console.error('Erro de conexão ao MongoDB:', err);
});
// ...

// --- Definição do Esquema (Schema) para o Usuário ---
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  senha: {
    type: String,
    required: true
  }
});
const User = mongoose.model('User', userSchema);

// --- Middlewares para processar requisições ---
app.use(express.json()); // Habilita o servidor a entender JSON
app.use(express.urlencoded({ extended: true })); // Habilita o servidor a entender dados de formulários

// --- Servindo arquivos estáticos (HTML, CSS, JS do seu site) ---
app.use(express.static(path.join(__dirname, '../')));

// --- Rota de Cadastro ---
app.post('/cadastro', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const novoUsuario = new User({ email, senha });
    await novoUsuario.save();
    res.status(201).send({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    res.status(400).send({ message: 'Erro ao cadastrar usuário. O e-mail já pode estar em uso.', error: error.message });
  }
});

// --- Rota de Login ---
// --- Rota de Login ---
app.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await User.findOne({ email });

    if (!usuario) {
      return res.status(404).send({ message: 'Usuário não encontrado.' });
    }

    if (usuario.senha !== senha) {
      return res.status(401).send({ message: 'Senha incorreta.' });
    }

    // --- Nova funcionalidade para mostrar os dados ---

    // 1. Imprime as informações no seu terminal (no servidor)
    console.log(`Login bem-sucedido! Usuário encontrado: ${usuario.email}`);

    // 2. Envia informações do usuário de volta para o cliente (navegador)
    res.status(200).send({
      message: 'Login bem-sucedido!',
      user: {
        email: usuario.email
      }
    });

  } catch (error) {
    res.status(500).send({ message: 'Erro no servidor.', error: error.message });
  }
});