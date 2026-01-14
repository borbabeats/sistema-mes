-- First, let's update the enum types if they don't exist
SET NAMES utf8mb4;

-- Update ordens_producao table
ALTER TABLE ordens_producao
ADD COLUMN descricao VARCHAR(500) NULL AFTER produto,
ADD COLUMN quantidadeProduzida INT NOT NULL DEFAULT 0 AFTER quantidadePlanejada,
MODIFY COLUMN status ENUM('RASCUNHO', 'PLANEJADA', 'EM_ANDAMENTO', 'PAUSADA', 'FINALIZADA', 'CANCELADA', 'ATRASADA') NOT NULL DEFAULT 'RASCUNHO',
ADD COLUMN prioridade ENUM('BAIXA', 'MEDIA', 'ALTA', 'URGENTE') NOT NULL DEFAULT 'MEDIA' AFTER status,
ADD COLUMN dataInicio DATETIME NULL AFTER prioridade,
ADD COLUMN dataFim DATETIME NULL AFTER dataInicio,
ADD COLUMN setorId INT NOT NULL AFTER dataFim,
ADD COLUMN responsavelId INT NULL AFTER setorId,
ADD COLUMN observacoes TEXT NULL AFTER responsavelId,
ADD COLUMN updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER createdAt,
ADD COLUMN deletedAt DATETIME NULL AFTER updatedAt,
ADD CONSTRAINT fk_ordem_producao_setor FOREIGN KEY (setorId) REFERENCES setores(id),
ADD CONSTRAINT fk_ordem_producao_responsavel FOREIGN KEY (responsavelId) REFERENCES usuarios(id);

-- Add indexes for better performance
CREATE INDEX idx_ordem_producao_setor ON ordens_producao(setorId);
CREATE INDEX idx_ordem_producao_responsavel ON ordens_producao(responsavelId);