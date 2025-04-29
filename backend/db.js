const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();  // Charger les variables d'environnement à partir du fichier .env

const db = mysql.createConnection({
    host: process.env.DB_HOST,  // 127.0.0.1
    user: process.env.DB_USER,  // root
    password: process.env.DB_PASSWORD,  // mot de passe MySQL
    database: process.env.DB_NAME,  // auth_system
    port: process.env.DB_PORT,  // 3308
});

db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion MySQL:', err);
        return;
    }
    console.log(`Connecté à MySQL sur le port ${process.env.DB_PORT}`);
});

module.exports = db;
