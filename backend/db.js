const mysql = require('mysql2');
const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

let db;

if (process.env.NODE_ENV === 'production') {
  // 🔐 Connexion PostgreSQL (ex: Render + Supabase)
  db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  console.log('✅ Connecté à PostgreSQL (production)');
} else {
  // 🛠️ Connexion MySQL locale
  db = mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'auth_system',
    port: process.env.DB_PORT || 3306,
  });

  db.connect((err) => {
    if (err) {
      console.error('❌ Erreur de connexion MySQL :', err);
    } else {
      console.log(`✅ Connecté à MySQL sur le port ${process.env.DB_PORT}`);
    }
  });
}

module.exports = db;
