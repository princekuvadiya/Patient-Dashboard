import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    const result = await register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      initialWeight: Number(formData.initialWeight),
      goalWeight: Number(formData.goalWeight),
      height: Number(formData.height)
    });

    if (!result.success) {
      setError(result.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <AuthForm
      type="register"
      onSubmit={handleSubmit}
      error={error}
      onNavigate={() => navigate('/login')}
      navigateText="Already have an account? Sign in"
    />
  );
};

export default RegisterPage;