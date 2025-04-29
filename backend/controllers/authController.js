const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendResetPasswordEmail } = require('../mailer'); // Fonction d'envoi de mail
const db = require('../db'); // Connexion MySQL

// Contrôleur : Inscription
exports.register = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Veuillez fournir un email et un mot de passe' });
    }

    try {
        // Vérification si l'utilisateur existe déjà
        const [existingUsers] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);

        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'Email déjà utilisé' });
        }

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertion de l'utilisateur dans la base de données
        await db.promise().query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);

        return res.status(201).json({ message: 'Utilisateur créé avec succès' });

    } catch (err) {
        console.error('Erreur serveur:', err);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Contrôleur : Connexion
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(400).json({ error: 'Email ou mot de passe incorrect' });
        }

        const user = users[0];

        // Comparaison du mot de passe
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Email ou mot de passe incorrect' });
        }

        // Création du token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({ message: 'Connexion réussie', token });

    } catch (err) {
        console.error('Erreur serveur:', err);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Contrôleur : Dashboard (protégé par le middleware)
exports.dashboard = (req, res) => {
    res.json({ message: `Bienvenue ${req.user.email} sur ton tableau de bord 🚀` });
};

// Contrôleur : Mot de passe oublié
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const [users] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(400).json({ error: 'Aucun utilisateur trouvé avec cet email' });
        }

        // Génération du token de réinitialisation
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiration = new Date(Date.now() + 3600000).toISOString().slice(0, 19).replace('T', ' '); // 1h

        // Mise à jour du token de réinitialisation et de son expiration dans la base de données
        await db.promise().query('UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?', [resetToken, resetTokenExpiration, email]);

        // Envoi de l'email avec le lien de réinitialisation
        const resetLink = `http://localhost:5174/reset-password/${resetToken}`;
        await sendResetPasswordEmail(email, resetLink);


        return res.status(200).json({ message: 'Un email avec un lien de réinitialisation a été envoyé.' });

    } catch (err) {
        console.error('Erreur serveur:', err);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Contrôleur : Réinitialisation du mot de passe
exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' '); // Format MySQL

        // Vérification du token et de son expiration
        const [users] = await db.promise().query('SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > ?', [token, currentTime]);

        if (users.length === 0) {
            return res.status(400).json({ error: 'Token invalide ou expiré' });
        }

        const user = users[0];
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Mise à jour du mot de passe et réinitialisation des informations du token
        await db.promise().query('UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE email = ?', [hashedPassword, user.email]);

        return res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });

    } catch (err) {
        console.error('Erreur serveur:', err);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};
