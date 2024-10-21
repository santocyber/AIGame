<?php
// Definir as credenciais de acesso ao banco de dados
define('DB_HOST', 'vendcard.mirako.org');    // Host do banco de dados
define('DB_USER', 'aigame');       // Usuário do banco de dados
define('DB_PASS', ''); // Senha do banco de dados
define('DB_NAME', 'aigame');       // Nome do banco de dados

// Conectar ao banco de dados com PDO
try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
    // Configurações para o PDO (opcional, mas recomendado)
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // Lançar exceções em caso de erro
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC); // Configuração padrão de fetch para array associativo
} catch (PDOException $e) {
    // Caso haja um erro, ele será exibido
    die("Erro ao conectar ao banco de dados: " . $e->getMessage());
}
?>
