DROP DATABASE IF EXISTS sistema_escola;
CREATE DATABASE sistema_escola;
USE sistema_escola;

-- 1. Tabela para Login e Criação de Contas
CREATE TABLE Usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome_completo VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    tipo_conta VARCHAR(50) NOT NULL,
    CHECK (tipo_conta IN ('Secretaria', 'Admin'))
) ENGINE=InnoDB;

-- 2. Tabela para o Cadastro de Alunos
CREATE TABLE Alunos (
    id_aluno INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    data_nascimento DATE,
    email VARCHAR(100),
    telefone VARCHAR(15)
) ENGINE=InnoDB;

-- 3. Tabela para Cursos e Turmas
CREATE TABLE Cursos_Turmas (
    id_turma INT AUTO_INCREMENT PRIMARY KEY,
    turma VARCHAR(100) NOT NULL,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    professor VARCHAR(100),
    capacidade INT NOT NULL,
    ocupacao INT NOT NULL DEFAULT 0,
    data_criacao DATE DEFAULT (CURRENT_DATE())
) ENGINE=InnoDB;

-- 4. Tabela para o Sistema de Matrículas
CREATE TABLE Matriculas (
    id_matricula INT AUTO_INCREMENT PRIMARY KEY,
    id_aluno INT NOT NULL,
    id_turma INT NOT NULL,
    status VARCHAR(20) NOT NULL,
    data_matricula DATE NOT NULL,

    CHECK (status IN ('Ativo', 'Inativo', 'Trancado', 'Concluído')),
    FOREIGN KEY (id_aluno) REFERENCES Alunos(id_aluno),
    FOREIGN KEY (id_turma) REFERENCES Cursos_Turmas(id_turma),
    UNIQUE (id_aluno, id_turma)
) ENGINE=InnoDB;

-- 5. Tabela para Notas e Histórico Escolar
CREATE TABLE Historico_Escolar (
    id_registro INT AUTO_INCREMENT PRIMARY KEY,
    id_aluno INT NOT NULL,
    disciplina VARCHAR(50) NOT NULL,
    nota DECIMAL(5, 2),
    presenca_percentual DECIMAL(5, 2),
    periodo VARCHAR(50) NOT NULL,
    status_aprovacao VARCHAR(20) NOT NULL,
    data_lancamento DATE DEFAULT (CURRENT_DATE()),

    CHECK (status_aprovacao IN ('Aprovado', 'Reprovado', 'Em Recuperação')),
    FOREIGN KEY (id_aluno) REFERENCES Alunos(id_aluno)
) ENGINE=InnoDB;

-- 6. Tabela para Atendimento da Secretaria
CREATE TABLE Solicitacoes_Secretaria (
    id_solicitacao INT AUTO_INCREMENT PRIMARY KEY,
    solicitante VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    descricao TEXT,
    prioridade VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    data_solicitacao DATE NOT NULL,
    data_ultima_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CHECK (prioridade IN ('Baixa', 'Média', 'Alta')),
    CHECK (status IN ('Aberto', 'Em Andamento', 'Resolvido'))
) ENGINE=InnoDB;
