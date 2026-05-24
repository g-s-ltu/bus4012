import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FloatingInput } from '../components/FloatingInput';
import { ThreeDButton } from '../components/ThreeDButton';

interface LoginPageProps {
  onRegisterStart: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onRegisterStart }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      return;
    }

    setIsLoading(true);

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const response = await fetch(`${apiBaseUrl}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        navigate('/login-success');
      } else {
        navigate('/login-failure');
      }
    } catch (error) {
      console.error('Login error:', error);
      navigate('/login-failure');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpClick = () => {
    onRegisterStart();
  };

  return (
    <div className="max-w-sm mx-auto px-6 py-10 bg-white min-h-screen">
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center">
          <span className="text-white text-2xl font-bold">LL</span>
        </div>
      </div>

      {/* Welcome Text */}
      <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">
        Welcome to LocalLend
      </h1>

      {/* Login Form */}
      <div className="space-y-6">
        <FloatingInput
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          required
        />

        <FloatingInput
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          required
          showPasswordToggle
        />

        {/* Login Button */}
        <ThreeDButton
          label="Log in with Digital ID"
          onClick={handleLogin}
          loading={isLoading}
          className="w-full"
        />

        {/* Forgot Password */}
        <p className="text-center text-gray-600 text-sm">
          Forgot Password?
        </p>

        {/* Sign Up Link */}
        <div className="text-center">
          <span className="text-gray-600">Don't have an account? </span>
          <Link
            to="/register"
            onClick={handleSignUpClick}
            className="text-primary-600 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};