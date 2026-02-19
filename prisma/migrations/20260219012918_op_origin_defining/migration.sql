-- CreateTable
CREATE TABLE `setores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted_at` TIMESTAMP NULL,

    UNIQUE INDEX `setores_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NULL,
    `telefone` VARCHAR(20) NULL,
    `senha` VARCHAR(255) NOT NULL,
    `cargo` ENUM('ADMIN', 'GERENTE', 'OPERADOR') NOT NULL DEFAULT 'OPERADOR',
    `turno` VARCHAR(50) NULL,
    `photo_profile` VARCHAR(255) NULL,
    `setor_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted_at` TIMESTAMP NULL,

    UNIQUE INDEX `usuarios_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `maquinas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(50) NOT NULL,
    `nome` VARCHAR(100) NOT NULL,
    `descricao` VARCHAR(500) NULL,
    `fabricante` VARCHAR(100) NULL,
    `modelo` VARCHAR(100) NULL,
    `numero_serie` VARCHAR(100) NULL,
    `ano_fabricacao` INTEGER NULL,
    `capacidade` VARCHAR(100) NULL,
    `status` ENUM('DISPONIVEL', 'EM_USO', 'MANUTENCAO', 'INATIVA', 'PARADA', 'DESATIVADA') NOT NULL DEFAULT 'DISPONIVEL',
    `horas_uso` DOUBLE NOT NULL DEFAULT 0,
    `setor_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` TIMESTAMP NULL,

    UNIQUE INDEX `maquinas_codigo_key`(`codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `manutencoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `maquina_id` INTEGER NOT NULL,
    `tipo` ENUM('PREVENTIVA', 'CORRETIVA', 'PREDITIVA', 'LUBRIFICACAO', 'CALIBRACAO', 'OUTRA') NOT NULL,
    `descricao` VARCHAR(500) NOT NULL,
    `data_agendada` DATETIME(3) NOT NULL,
    `data_inicio` DATETIME(3) NULL,
    `data_fim` DATETIME(3) NULL,
    `status` ENUM('AGENDADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA', 'ATRASADA') NOT NULL DEFAULT 'AGENDADA',
    `custo_estimado` DECIMAL(10, 2) NULL,
    `custo_real` DECIMAL(10, 2) NULL,
    `responsavel_id` INTEGER NULL,
    `observacoes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `historico_manutencoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `manutencao_id` INTEGER NOT NULL,
    `status_anterior` VARCHAR(50) NULL,
    `status_novo` VARCHAR(50) NOT NULL,
    `descricao` VARCHAR(500) NOT NULL,
    `data_registro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ordens_producao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(50) NOT NULL,
    `produto` VARCHAR(150) NOT NULL,
    `descricao` VARCHAR(500) NULL,
    `quantidadePlanejada` INTEGER NOT NULL,
    `quantidadeProduzida` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('RASCUNHO', 'PLANEJADA', 'EM_ANDAMENTO', 'PAUSADA', 'FINALIZADA', 'CANCELADA', 'ATRASADA') NOT NULL DEFAULT 'RASCUNHO',
    `prioridade` ENUM('BAIXA', 'MEDIA', 'ALTA', 'URGENTE') NOT NULL DEFAULT 'MEDIA',
    `dataInicioPlanejado` DATETIME(3) NULL,
    `dataFimPlanejado` DATETIME(3) NULL,
    `dataInicioReal` DATETIME(3) NULL,
    `dataFimReal` DATETIME(3) NULL,
    `setorId` INTEGER NOT NULL,
    `responsavelId` INTEGER NULL,
    `origemTipo` ENUM('PEDIDO_VENDA', 'REPOSICAO_ESTOQUE', 'PLANO_MESTRE_PRODUCAO', 'DEMANDA_INTERNA', 'PREVISAO_VENDAS') NULL DEFAULT 'PEDIDO_VENDA',
    `origemId` VARCHAR(100) NULL,
    `observacoes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `ordens_producao_codigo_key`(`codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `apontamentos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `opId` INTEGER NOT NULL,
    `maquinaId` INTEGER NOT NULL,
    `usuarioId` INTEGER NOT NULL,
    `quantidadeProduzida` INTEGER NOT NULL DEFAULT 0,
    `quantidadeDefeito` INTEGER NOT NULL DEFAULT 0,
    `dataInicio` DATETIME(3) NOT NULL,
    `dataFim` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `config_notificacoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `tipoEvento` ENUM('MAQUINA_PARADA', 'OP_ATRASADA', 'DEFEITO_ALTO', 'OP_FINALIZADA') NOT NULL,
    `valorCritico` DECIMAL(10, 2) NULL,
    `enviarWhatsapp` BOOLEAN NOT NULL DEFAULT false,
    `enviarWebSocket` BOOLEAN NOT NULL DEFAULT true,
    `ativo` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notificacao_destinatarios` (
    `configId` INTEGER NOT NULL,
    `usuarioId` INTEGER NOT NULL,

    PRIMARY KEY (`configId`, `usuarioId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `log_notificacoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `configId` INTEGER NOT NULL,
    `usuarioId` INTEGER NOT NULL,
    `mensagem` VARCHAR(191) NULL,
    `dataEnvio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `statusEnvio` ENUM('SUCESSO', 'FALHA') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_OrdemProducaoOperadores` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_OrdemProducaoOperadores_AB_unique`(`A`, `B`),
    INDEX `_OrdemProducaoOperadores_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_setor_id_fkey` FOREIGN KEY (`setor_id`) REFERENCES `setores`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `maquinas` ADD CONSTRAINT `maquinas_setor_id_fkey` FOREIGN KEY (`setor_id`) REFERENCES `setores`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `manutencoes` ADD CONSTRAINT `manutencoes_maquina_id_fkey` FOREIGN KEY (`maquina_id`) REFERENCES `maquinas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `manutencoes` ADD CONSTRAINT `manutencoes_responsavel_id_fkey` FOREIGN KEY (`responsavel_id`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historico_manutencoes` ADD CONSTRAINT `historico_manutencoes_manutencao_id_fkey` FOREIGN KEY (`manutencao_id`) REFERENCES `manutencoes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ordens_producao` ADD CONSTRAINT `ordens_producao_setorId_fkey` FOREIGN KEY (`setorId`) REFERENCES `setores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ordens_producao` ADD CONSTRAINT `ordens_producao_responsavelId_fkey` FOREIGN KEY (`responsavelId`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `apontamentos` ADD CONSTRAINT `apontamentos_opId_fkey` FOREIGN KEY (`opId`) REFERENCES `ordens_producao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `apontamentos` ADD CONSTRAINT `apontamentos_maquinaId_fkey` FOREIGN KEY (`maquinaId`) REFERENCES `maquinas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `apontamentos` ADD CONSTRAINT `apontamentos_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notificacao_destinatarios` ADD CONSTRAINT `notificacao_destinatarios_configId_fkey` FOREIGN KEY (`configId`) REFERENCES `config_notificacoes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notificacao_destinatarios` ADD CONSTRAINT `notificacao_destinatarios_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `log_notificacoes` ADD CONSTRAINT `log_notificacoes_configId_fkey` FOREIGN KEY (`configId`) REFERENCES `config_notificacoes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `log_notificacoes` ADD CONSTRAINT `log_notificacoes_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_OrdemProducaoOperadores` ADD CONSTRAINT `_OrdemProducaoOperadores_A_fkey` FOREIGN KEY (`A`) REFERENCES `ordens_producao`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_OrdemProducaoOperadores` ADD CONSTRAINT `_OrdemProducaoOperadores_B_fkey` FOREIGN KEY (`B`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
