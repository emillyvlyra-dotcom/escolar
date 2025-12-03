// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt'); // Usado para hashear e verificar senhas de forma segura
const app = express();
const port = 3000;

// Middleware para processar JSON nas requisições
app.use(express.json());
app.use(cors());

// --- 🔑 CONFIGURAÇÃO DO BANCO DE DADOS ---
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};

let connection;

async function connectDB() {
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Conexão com o MySQL estabelecida com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao conectar ao MySQL:', error.message);
        // Tente novamente ou encerre o processo, se necessário
        process.exit(1); 
    }
}

connectDB();


// ----------------------------------------------------
// 1. ROTA DE CADASTRO DE USUÁRIO (Criar Conta)
// URL: POST /register
// Baseado na tabela 'Usuarios'
// ----------------------------------------------------

app.post('/register', async (req, res) => {
    const { nome_completo, email, senha, tipo_conta } = req.body;

    // 1. Validar Tipo de Conta
    const tiposPermitidos = ['Secretaria', 'Admin'];
    if (!tiposPermitidos.includes(tipo_conta)) {
        return res.status(400).json({ error: 'Tipo de conta inválido. Use "Secretaria" ou "Admin".' });
    }

    try {
        // 2. Gerar o Hash da Senha (Segurança!)
        const saltRounds = 10;
        const senha_hash = await bcrypt.hash(senha, saltRounds);

        // 3. Inserir o novo usuário no banco de dados
        const [result] = await connection.execute(
            'INSERT INTO Usuarios (nome_completo, email, senha_hash, tipo_conta) VALUES (?, ?, ?, ?)',
            [nome_completo, email, senha_hash, tipo_conta]
        );

        res.status(201).json({ 
            message: 'Usuário cadastrado com sucesso!', 
            id_usuario: result.insertId 
        });

    } catch (error) {
        // Código de erro 1062 é DUPLICATE ENTRY (e-mail já existe)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Este e-mail já está cadastrado.' });
        }
        console.error('Erro no cadastro:', error);
        res.status(500).json({ error: 'Erro interno no servidor ao cadastrar usuário.' });
    }
});


// ----------------------------------------------------
// 2. ROTA DE LOGIN
// URL: POST /login
// Baseado na tabela 'Usuarios'
// ----------------------------------------------------

app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        // 1. Buscar o usuário pelo e-mail
        const [rows] = await connection.execute(
            'SELECT id_usuario, nome_completo, senha_hash, tipo_conta FROM Usuarios WHERE email = ?',
            [email]
        );

        const usuario = rows[0];

        // 2. Verificar se o usuário existe
        if (!usuario) {
            return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
        }

        // 3. Comparar a senha fornecida com o hash armazenado
        const match = await bcrypt.compare(senha, usuario.senha_hash);

        if (!match) {
            return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
        }

        // 4. Login bem-sucedido
        // Aqui você deve gerar um token JWT (JSON Web Token) para manter o usuário logado
        // Por enquanto, apenas retornamos os dados básicos (SEM A SENHA HASH!)

        res.status(200).json({
            message: 'Login realizado com sucesso!',
            usuario: {
                id_usuario: usuario.id_usuario,
                nome: usuario.nome_completo,
                email: usuario.email,
                tipo_conta: usuario.tipo_conta
            }
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro interno no servidor ao realizar login.' });
    }
});


// ----------------------------------------------------
// INÍCIO DO SERVIDOR
// ----------------------------------------------------
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});