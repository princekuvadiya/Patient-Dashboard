import { useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

const AuthForm = ({ type, onSubmit, error, onNavigate, navigateText }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    initialWeight: '',
    goalWeight: '',
    height: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRegister = type === 'register';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(formData);
    setIsSubmitting(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-lg p-8 space-y-8 bg-white rounded-xl shadow-lg sm:max-w-md md:max-w-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            {isRegister ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="mt-2 text-sm text-gray-600 md:text-base">
            {isRegister
              ? 'Join Acme Corp to start your weight loss journey'
              : 'Log in to track your progress'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="text-red-600 text-sm">{error}</div>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {isRegister && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  name="firstName"
                  type="text"
                  required
                  className="mt-1 text-black block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  name="lastName"
                  type="text"
                  required
                  className="mt-1 text-black block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="mt-1 text-black block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="mt-1  text-black block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>

          {isRegister && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  className="mt-1 text-black block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Height (cm)
                  </label>
                  <input
                    name="height"
                    type="number"
                    required
                    className="mt-1 text-black  block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Start Weight (kg)
                  </label>
                  <input
                    name="initialWeight"
                    type="number"
                    step="0.1"
                    required
                    className="mt-1 block  text-black  w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Goal Weight (kg)
                  </label>
                  <input
                    name="goalWeight"
                    type="number"
                    step="0.1"
                    required
                    className="mt-1 block text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2.5 px-4 border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? <LoadingSpinner /> : isRegister ? 'Create Account' : 'Sign In'}
          </button>

          <div className="text-center text-sm">
            <button
              type="button"
              onClick={onNavigate}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {navigateText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;