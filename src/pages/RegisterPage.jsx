import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RegisterFace } from '../components/RegisterFace';
import styles from '../components/Layout.module.css';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = (name, descriptor) => {
    register(name, descriptor);
    navigate('/dashboard');
  };

  return (
    <div className={styles.container}>
      <div className={styles.appHeader}>
        <h1>Face Recognition</h1>
        <p>Authenticate with your face to continue</p>
      </div>

      <RegisterFace onRegister={handleRegister} />

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p>
          Already have a profile? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}
