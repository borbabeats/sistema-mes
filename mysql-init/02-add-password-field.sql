-- Adicionar campo senha à tabela usuarios
ALTER TABLE usuarios ADD COLUMN senha VARCHAR(255) NOT NULL DEFAULT '';

-- Atualizar senhas para os usuários existentes (senha: '123456' criptografada)
UPDATE usuarios SET senha = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.' WHERE email = 'admin@mes.com';
UPDATE usuarios SET senha = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.' WHERE email = 'gerente@mes.com';
UPDATE usuarios SET senha = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.' WHERE email = 'operador1@mes.com';
UPDATE usuarios SET senha = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.' WHERE email = 'gerente.q@mes.com';
