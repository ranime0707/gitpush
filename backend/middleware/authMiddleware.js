const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Accès refusé. Token manquant ou mal formé.' });
    }

    const token = authHeader.slice(7);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Erreur lors de la vérification du token:', err);

        if (err instanceof jwt.JsonWebTokenError) {
            return res.status(403).json({ error: 'Token invalide ou mal formé.' });
        }

        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ error: 'Token expiré. Veuillez vous reconnecter.' });
        }

        return res.status(403).json({ error: 'Erreur lors de la vérification du token.' });
    }
};

module.exports = authenticateToken; // ✅ Export par défaut
