const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Charger les variables d'environnement
dotenv.config();

// Initialiser express
const app = express();

// CORS : Accepter les origines multiples
const allowedOrigins = [
  'http://localhost:5173', // Frontend Vite par défaut
  'http://localhost:5174', // Ajout de l'autre origine
];

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // Autoriser l'origine
    } else {
      callback(new Error('Not allowed by CORS')); // Refuser l'origine
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,  // Pour accepter les cookies si nécessaire
};

app.use(cors(corsOptions));  // Appliquer la configuration CORS

// Middleware pour parser les données JSON
app.use(express.json());

// Import des contrôleurs et middleware
const authController = require('./controllers/authController');
const authenticateToken = require('./middleware/authMiddleware');

// ==================== ROUTES ====================

// Authentification
app.post('/login', authController.login);
app.post('/register', authController.register);

// Mot de passe oublié & réinitialisation
app.post('/forgot-password', authController.forgotPassword);
app.post('/reset-password/:token', authController.resetPassword);

// Tableau de bord utilisateur (protégé)
app.get('/dashboard', authenticateToken, authController.dashboard);

// Exemple de route protégée
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: `Bienvenue ${req.user.email} sur ton tableau de bord 🚀` });
});

// ==================== SERVEUR ====================
const PORT = process.env.PORT || 5000;  // Utilisation de la variable d'environnement pour le port
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend démarré sur le port ${PORT}`);
});
