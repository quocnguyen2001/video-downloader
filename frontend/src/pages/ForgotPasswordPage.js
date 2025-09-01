import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Logo from '../components/Logo';
import { useAuth } from '../hooks/useAuth';

const ForgotPasswordPage = () => {
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleEmailChange = e => {
    setEmail(e.target.value);
    if (error) {
      setError('');
    }
  };

  const validateEmail = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateEmail()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await forgotPassword(email);

      if (result.success) {
        // Clear any previous errors and show success state
        setError('');
        setIsSubmitted(true);
      }
      // On error, keep the email field intact so user doesn't have to re-enter
      // Error handling is done in the useAuth hook with toast notifications
    } catch (error) {
      // This catch block should rarely be reached since useAuth handles errors
      console.error('Unexpected forgot password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Layout showFooter={false}>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md lg:max-w-lg w-full space-y-8">
            <div className="text-center">
              <Logo size="large" className="justify-center" />
              <div className="mt-6">
                <div className="text-6xl mb-4">📧</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Check your email
                </h2>
                <p className="text-gray-600 mb-6">
                  We've sent a password reset link to{' '}
                  <span className="font-medium text-gray-900">{email}</span>
                </p>
                <p className="text-sm text-gray-500 mb-8">
                  Didn't receive the email? Check your spam folder or{' '}
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    try again
                  </button>
                </p>
                <div className="space-y-3">
                  <Link
                    to={`/reset-password?email=${encodeURIComponent(email)}`}
                  >
                    <Button variant="primary" size="large" className="w-full">
                      Enter OTP & Reset Password
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="large" className="w-full">
                      Back to login
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showFooter={false}>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md lg:max-w-lg w-full space-y-8">
          <div className="text-center">
            <Logo size="large" className="justify-center" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Forgot your password?
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          <Card padding="large">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email address"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                error={error}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="large"
                loading={isLoading}
                className="w-full"
              >
                Send reset link
              </Button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Back to login
                </Link>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPasswordPage;
