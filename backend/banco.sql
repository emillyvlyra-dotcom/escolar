-- 1. Tabela para o Login e Criação de Contas
DROP TABLE IF EXISTS Usuarios;

CREATE TABLE Usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome_completo VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    tipo_conta VARCHAR(50) NOT NULL,
    CHECK (tipo_conta IN ('Secretaria', 'Professor', 'Admin'))
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
    CHECK (status IN ('Aberto', 'Andamento', 'Resolvido'))
) ENGINE=InnoDB;


INSERT INTO Usuarios (nome_completo, email, senha_hash, tipo_conta) VALUES
('Maria da Silva', 'maria.secretaria@escola.com', 'hash12345', 'Secretaria'),
('Carlos Pereira', 'carlos.prof@escola.com', 'hash12345', 'Professor'),
('Ana Souza', 'ana.admin@escola.com', 'hash12345', 'Admin'),
('João Almeida', 'joao.prof@escola.com', 'hash12345', 'Professor'),
('Fernanda Rocha', 'fernanda.secretaria@escola.com', 'hash12345', 'Secretaria');



INSERT INTO Alunos (nome, cpf, data_nascimento, email, telefone) VALUES
('Lucas Andrade', '123.456.789-01', '2008-03-10', 'lucas@gmail.com', '(11)90000-0001'),
('Mariana Costa', '987.654.321-00', '2007-11-25', 'mariana@gmail.com', '(11)90000-0002'),
('Pedro Oliveira', '321.654.987-22', '2009-07-14', 'pedro@gmail.com', '(11)90000-0003'),
('Beatriz Ramos', '741.852.963-55', '2006-01-20', 'bia@gmail.com', '(11)90000-0004'),
('Gabriel Lima', '852.963.741-33', '2008-09-05', 'gabriel@gmail.com', '(11)90000-0005');

INSERT INTO Cursos_Turmas (turma, codigo, professor, capacidade, ocupacao) VALUES
('Matemática - 8º Ano A', 'MAT8A', 'Carlos Pereira', 30, 0),
('Português - 8º Ano A', 'PORT8A', 'João Almeida', 30, 0),
('História - 9º Ano B', 'HIST9B', 'Carlos Pereira', 25, 0),
('Geografia - 7º Ano C', 'GEO7C', 'João Almeida', 35, 0),
('Ciências - 6º Ano A', 'CIE6A', 'Carlos Pereira', 40, 0);

INSERT INTO Matriculas (id_aluno, id_turma, status, data_matricula) VALUES
(1, 1, 'Ativo', '2025-02-01'),
(1, 2, 'Ativo', '2025-02-01'),
(2, 1, 'Ativo', '2025-02-01'),
(3, 3, 'Ativo', '2025-02-01'),
(4, 4, 'Ativo', '2025-02-01'),
(5, 5, 'Ativo', '2025-02-01');

UPDATE Cursos_Turmas 
SET ocupacao = (
    SELECT COUNT(*) FROM Matriculas 
    WHERE id_turma = Cursos_Turmas.id_turma
)
WHERE id_turma > 0;


INSERT INTO Historico_Escolar (id_aluno, disciplina, nota, presenca_percentual, periodo, status_aprovacao) VALUES
(1, 'Matemática', 8.5, 92, '2024', 'Aprovado'),
(1, 'Português', 7.0, 88, '2024', 'Aprovado'),
(2, 'Matemática', 5.2, 75, '2024', 'Em Recuperação'),
(3, 'História', 9.0, 96, '2024', 'Aprovado'),
(4, 'Geografia', 4.8, 60, '2024', 'Reprovado'),
(5, 'Ciências', 8.0, 90, '2024', 'Aprovado');

INSERT INTO Solicitacoes_Secretaria 
(solicitante, tipo, descricao, prioridade, status, data_solicitacao) VALUES
('Lucas Andrade', 'Declaração de Matrícula', 'Solicita declaração para estágio.', 'Média', 'Aberto', '2025-03-01'),
('Mariana Costa', 'Atualização de Cadastro', 'Alteração de endereço.', 'Baixa', 'Em Andamento', '2025-02-20'),
('Pedro Oliveira', 'Histórico Escolar', 'Precisa do histórico completo.', 'Alta', 'Aberto', '2025-03-02'),
('Beatriz Ramos', '2ª via do Boletim', 'Perdeu o boletim do período anterior.', 'Baixa', 'Concluído', '2025-01-10'),
('Gabriel Lima', 'Transferência', 'Solicita transferência para outra escola.', 'Alta', 'Em Andamento', '2025-03-05');