import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:5000/reset-password/${token}`, {
        newPassword
      });
      setMessage(res.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur serveur');
      setMessage('');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Réinitialiser le mot de passe</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="password"
          placeholder="Nouveau mot de passe"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Réinitialiser
        </button>
      </form>
      {message && <p style={styles.success}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: 'auto',
    padding: '2rem',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '1rem',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  success: {
    color: 'green',
    marginTop: '1rem',
  },
  error: {
    color: 'red',
    marginTop: '1rem',
  },
};

export default ResetPassword;
