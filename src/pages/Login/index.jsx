import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './style.module.css';

const ADMIN_PASSWORD = 'sonIA123**';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password === ADMIN_PASSWORD) {
      // Salvar no localStorage que está autenticado
      localStorage.setItem('adminAuth', 'true');
      navigate('/admin');
    } else {
      setError('Senha incorreta!');
      setPassword('');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1>Admin Login</h1>
        <p>Digite a senha de administrador</p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            className={styles.input}
            autoFocus
          />
          
          {error && <p className={styles.error}>{error}</p>}
          
          <button type="submit" className={styles.button}>
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}