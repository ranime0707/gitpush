import React from 'react';
import { useNavigate } from 'react-router-dom';




const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        history.push('/login'); // Redirige l'utilisateur vers la page de connexion
    };

    return (
        <div style={styles.container}>
            <h2>Bienvenue sur ton tableau de bord</h2>
            <p>Tu es connecté !</p>
            <button onClick={handleLogout} style={styles.button}>Se déconnecter</button>
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
    button: {
        padding: '10px 15px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
    },
};

export default Dashboard;
