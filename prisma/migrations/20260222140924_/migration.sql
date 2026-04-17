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
