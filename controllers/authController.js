import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { sendResetPasswordEmail } from '../../mailer'; // Importer la fonction d'envoi d'email
import { promise } from '../../db'; // Importer la connexion à la base de données

// Register Controller
export async function register(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Veuillez fournir un email et un mot de passe' });
    }

    try {
        const [existingUsers] = await promise().query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'Email déjà utilisé' });
        }

        const hashedPassword = await hash(password, 10);
        await promise().query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);

        return res.status(201).json({ message: 'Utilisateur créé avec succès' });
    } catch (err) {
        console.error('Erreur serveur:', err);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
}

// Login Controller
export async function login(req, res) {
    const { email, password } = req.body;

    try {
        const [users] = await promise().query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(400).json({ error: 'Email ou mot de passe incorrect' });
        }

        const user = users[0];
        const isMatch = await compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Email ou mot de passe incorrect' });
        }

        const token = sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({ message: 'Connexion réussie', token });

    } catch (err) {
        console.error('Erreur serveur:', err);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
}

// Dashboard Controller (Protégé par le token)
export function dashboard(req, res) {
    res.json({ message: `Bienvenue ${req.user.email} sur ton tableau de bord 🚀` });
}

// Forgot Password Controller
export async function forgotPassword(req, res) {
    const { email } = req.body;

    try {
        const [user] = await promise().query('SELECT * FROM users WHERE email = ?', [email]);

        if (user.length === 0) {
            return res.status(400).json({ error: 'Aucun utilisateur trouvé avec cet email' });
        }

        // Générer un token unique pour la réinitialisation du mot de passe
        const resetToken = randomBytes(32).toString('hex');
        const resetTokenExpiration = new Date(Date.now() + 3600000).toISOString().slice(0, 19).replace('T', ' '); // Format MySQL DATETIME

        // Enregistrer le token et l'expiration dans la base de données
        await promise().query(
            'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?',
            [resetToken, resetTokenExpiration, email]
        );

        // Envoyer l'email avec le lien de réinitialisation
        await sendResetPasswordEmail(email, resetToken);

        return res.status(200).json({ message: 'Un email avec un lien de réinitialisation a été envoyé.' });

    } catch (err) {
        console.error('Erreur serveur:', err);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
}

// Reset Password Controller
export async function resetPassword(req, res) {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        // Vérifier si le token existe dans la base de données
        const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const [users] = await promise().query(
            'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > ?',
            [token, currentTime]
        );

        if (users.length === 0) {
            return res.status(400).json({ error: 'Token invalide ou expiré' });
        }

        const user = users[0];

        // Hacher le nouveau mot de passe
        const hashedPassword = await hash(newPassword, 10);

        // Mettre à jour le mot de passe et réinitialiser le token
        await promise().query(
            'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE email = ?',
            [hashedPassword, user.email]
        );

        return res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });

    } catch (err) {
        console.error('Erreur serveur:', err);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
}
