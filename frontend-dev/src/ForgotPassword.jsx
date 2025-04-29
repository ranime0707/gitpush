import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/forgot-password', { email });
            setMessage('Un email avec un lien de réinitialisation a été envoyé.');
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur serveur');
            setMessage('');
        }
    };

    return (
        <div style={styles.container}>
            <h2>Mot de passe oublié</h2>
            {message && <p style={styles.success}>{message}</p>}
            {error && <p style={styles.error}>{error}</p>}
            <form onSubmit={handleForgotPassword} style={styles.form}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Réinitialiser le mot de passe</button>
            </form>
            <div style={styles.footer}>
                <p>Se souvenir de votre mot de passe ? <a href="/login">Se connecter</a></p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto',
        padding: '20px',
        textAlign: 'center',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    input: {
        padding: '10px',
        fontSize: '16px',
        margin: '5px 0',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    button: {
        padding: '10px 15px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    footer: {
        marginTop: '20px',
        fontSize: '14px',
    },
    error: {
        color: 'red',
    },
    success: {
        color: 'green',
    },
};

export default ForgotPassword;
