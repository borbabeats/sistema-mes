/*
  Warnings:

  - You are about to alter the column `deleted_at` on the `maquinas` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `deleted_at` on the `setores` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `deleted_at` on the `usuarios` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `maquinas` MODIFY `deleted_at` TIMESTAMP NULL;

-- AlterTable
ALTER TABLE `setores` MODIFY `deleted_at` TIMESTAMP NULL;

-- AlterTable
ALTER TABLE `usuarios` MODIFY `deleted_at` TIMESTAMP NULL;

-- CreateTable
CREATE TABLE `ordem_producao_status_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ordem_id` INTEGER NOT NULL,
    `de_status` ENUM('RASCUNHO', 'PLANEJADA', 'EM_ANDAMENTO', 'PAUSADA', 'FINALIZADA', 'CANCELADA', 'ATRASADA') NOT NULL,
    `para_status` ENUM('RASCUNHO', 'PLANEJADA', 'EM_ANDAMENTO', 'PAUSADA', 'FINALIZADA', 'CANCELADA', 'ATRASADA') NOT NULL,
    `motivo` TEXT NULL,
    `usuario_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ordem_producao_status_logs` ADD CONSTRAINT `ordem_producao_status_logs_ordem_id_fkey` FOREIGN KEY (`ordem_id`) REFERENCES `ordens_producao`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ordem_producao_status_logs` ADD CONSTRAINT `ordem_producao_status_logs_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
