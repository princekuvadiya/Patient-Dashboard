import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async ({ email, password }) => {
    setError('');
    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.message || 'Invalid email or password');
    }
  };

  return (
    <AuthForm
      type="login"
      onSubmit={handleSubmit}
      error={error}
      onNavigate={() => navigate('/register')}
      navigateText="Don't have an account? Register"
    />
  );
};

export default LoginPage;