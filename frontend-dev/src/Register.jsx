import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/register', { email, password }); // Appel API
            navigate('/login'); // Rediriger vers la page de connexion
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur serveur');
        }
    };

    return (
        <div style={styles.container}>
            <h2>Inscription</h2>
            {error && <p style={styles.error}>{error}</p>}
            <form onSubmit={handleRegister} style={styles.form}>
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
                <button type="submit" style={styles.button}>S'inscrire</button>
            </form>
            <div style={styles.footer}>
                <p>Déjà inscrit ? <a href="/login">Se connecter</a></p>
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
    }
};

export default Register;
