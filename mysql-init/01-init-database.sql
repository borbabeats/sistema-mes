-- Criação do Banco de Dados
CREATE DATABASE mes_system;

USE mes_system;

-- Tabela de Setores
CREATE TABLE setores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

-- Tabela de Usuários (Gerentes e Operadores)
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    telefone VARCHAR(20), -- Para WhatsApp
    cargo ENUM('ADMIN', 'GERENTE', 'OPERADOR') DEFAULT 'OPERADOR',
    setor_id INT,
    FOREIGN KEY (setor_id) REFERENCES setores(id)
);

-- Tabela de Máquinas
CREATE TABLE maquinas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    setor_id INT,
    status ENUM('OPERANDO', 'PARADA', 'MANUTENCAO') DEFAULT 'PARADA',
    FOREIGN KEY (setor_id) REFERENCES setores(id)
);

-- Tabela de Ordens de Produção (OP)
CREATE TABLE ordens_producao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    produto VARCHAR(150) NOT NULL,
    quantidade_planejada INT NOT NULL,
    status ENUM('PENDENTE', 'EM_CURSO', 'FINALIZADA', 'CANCELADA') DEFAULT 'PENDENTE',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Apontamentos (Onde a produção é registrada)
CREATE TABLE apontamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    op_id INT,
    maquina_id INT,
    usuario_id INT,
    quantidade_produzida INT DEFAULT 0,
    quantidade_defeito INT DEFAULT 0,
    data_inicio DATETIME NOT NULL,
    data_fim DATETIME,
    FOREIGN KEY (op_id) REFERENCES ordens_producao(id),
    FOREIGN KEY (maquina_id) REFERENCES maquinas(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- MOTOR DE NOTIFICAÇÕES CONFIGURÁVEL
CREATE TABLE config_notificacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    tipo_evento ENUM('MAQUINA_PARADA', 'OP_ATRASADA', 'DEFEITO_ALTO', 'OP_FINALIZADA') NOT NULL,
    valor_critico DECIMAL(10,2), -- Ex: % de defeito ou minutos de parada
    enviar_whatsapp BOOLEAN DEFAULT FALSE,
    enviar_web_socket BOOLEAN DEFAULT TRUE,
    ativo BOOLEAN DEFAULT TRUE
);

-- Relacionamento: Quais gerentes recebem qual configuração
CREATE TABLE notificacao_destinatarios (
    config_id INT,
    usuario_id INT,
    PRIMARY KEY (config_id, usuario_id),
    FOREIGN KEY (config_id) REFERENCES config_notificacoes(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Log de envios para auditoria
CREATE TABLE log_notificacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    config_id INT,
    usuario_id INT,
    mensagem TEXT,
    data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_envio ENUM('SUCESSO', 'FALHA'),
    FOREIGN KEY (config_id) REFERENCES config_notificacoes(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Inserir dados de exemplo
INSERT INTO setores (nome) VALUES 
('Produção'),
('Montagem'),
('Qualidade'),
('Manutenção');

INSERT INTO usuarios (nome, email, telefone, cargo, setor_id) VALUES 
('Administrador', 'admin@mes.com', '11999999999', 'ADMIN', 1),
('Gerente Produção', 'gerente@mes.com', '11988888888', 'GERENTE', 1),
('Operador 1', 'operador1@mes.com', '11977777777', 'OPERADOR', 1),
('Gerente Qualidade', 'gerente.q@mes.com', '11966666666', 'GERENTE', 3);

INSERT INTO maquinas (nome, setor_id, status) VALUES 
('Máquina Injetora 1', 1, 'OPERANDO'),
('Máquina Injetora 2', 1, 'PARADA'),
('Esteira Montagem', 2, 'OPERANDO'),
('Mesa Teste', 3, 'OPERANDO');

INSERT INTO ordens_producao (codigo, produto, quantidade_planejada) VALUES 
('OP-2025-001', 'Produto A - Caixa 500ml', 1000),
('OP-2025-002', 'Produto B - Tampa 500ml', 2000),
('OP-2025-003', 'Produto C - Conjunto Completo', 500);

INSERT INTO config_notificacoes (nome, tipo_evento, valor_critico, enviar_whatsapp, enviar_web_socket, ativo) VALUES 
('Parada de Máquina Crítica', 'MAQUINA_PARADA', 30.00, TRUE, TRUE, TRUE),
('Taxa de Defeito Alta', 'DEFEITO_ALTO', 5.00, TRUE, TRUE, TRUE),
('OP Atrasada', 'OP_ATRASADA', 60.00, FALSE, TRUE, TRUE),
('Finalização de OP', 'OP_FINALIZADA', NULL, FALSE, TRUE, TRUE);

INSERT INTO notificacao_destinatarios (config_id, usuario_id) VALUES 
(1, 2), (1, 4), -- Parada de máquina para gerentes
(2, 4), -- Defeito para gerente de qualidade
(3, 2), -- OP atrasada para gerente de produção
(4, 2), (4, 4); -- OP finalizada para todos gerentes
