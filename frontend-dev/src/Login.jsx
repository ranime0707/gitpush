import React, { useState } from 'react';
import { loginUser } from './services/authService'; // ✅ chemin mis à jour
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // ✅ à l’intérieur du composant

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await loginUser(email, password);
            localStorage.setItem('token', data.token);
            navigate('/dashboard'); // ✅ navigation après login
        } catch (err) {
            setError(err.error || 'Erreur serveur');
        }
    };

    return (
        <div style={styles.container}>
            <h2>Connexion</h2>
            {error && <p style={styles.error}>{error}</p>}
            <form onSubmit={handleLogin} style={styles.form}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={styles.input}
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Se connecter</button>
            </form>
            <div style={styles.footer}>
                <p>Pas encore inscrit ? <a href="/register">S'inscrire</a></p>
                <p><a href="/forgot-password">Mot de passe oublié ?</a></p>
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
        backgroundColor: '#007BFF',
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
    }
};

export default Login;
