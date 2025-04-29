const nodemailer = require('nodemailer');

// Fonction pour envoyer l'email de réinitialisation du mot de passe
const sendResetPasswordEmail = async (email, resetToken) => {
    try {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5174';
        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

        // Crée le transporteur d'email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Définir les options de l'email
        const mailOptions = {
            from: `"Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Réinitialisation de votre mot de passe',
            html: `
                <p>Bonjour,</p>
                <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
                <p>Cliquez sur le lien ci-dessous pour définir un nouveau mot de passe :</p>
                <a href="${resetUrl}">${resetUrl}</a>
                <p><i>Ce lien expirera dans 1 heure.</i></p>
                <p>Cordialement,<br>L'équipe</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log('✅ Email de réinitialisation envoyé à :', email);
    } catch (error) {
        console.error('❌ Erreur lors de l’envoi de l’email :', error);
        throw new Error('Échec de l\'envoi de l\'email de réinitialisation.');
    }
};

module.exports = { sendResetPasswordEmail };
