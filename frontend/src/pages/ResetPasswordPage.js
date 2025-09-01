import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Logo from '../components/Logo';
import { authService } from '../services/auth';
import { handleApiError } from '../utils/errorHandler';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailFromParams = searchParams.get('email') || '';

  const [formData, setFormData] = useState({
    email: emailFromParams,
    otp: '',
    password: '',
    passwordConfirmation: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = field => e => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.otp.trim()) {
      newErrors.otp = 'OTP is required';
    } else if (formData.otp.length !== 6) {
      newErrors.otp = 'OTP must be 6 digits';
    }

    if (!formData.password) {
      newErrors.password = 'New password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.passwordConfirmation) {
      newErrors.passwordConfirmation = 'Password confirmation is required';
    } else if (formData.password !== formData.passwordConfirmation) {
      newErrors.passwordConfirmation = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const { message } = await authService.resetPassword(formData);

      // Show success message
      toast.success(message || 'Password reset successfully!');

      // Redirect to login page after successful reset
      navigate('/login', {
        replace: true,
        state: {
          message:
            'Password reset successfully. Please login with your new password.',
        },
      });
    } catch (error) {
      const errorMessage = handleApiError(error, 'Failed to reset password');

      // Handle validation errors
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }

      // Show error toast
      toast.error(errorMessage);
      console.error('Password reset error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout showFooter={false}>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md lg:max-w-lg w-full space-y-8">
          <div className="text-center">
            <Logo size="large" className="justify-center" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Reset your password
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter the OTP sent to your email and your new password.
            </p>
          </div>

          <Card padding="large">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email address"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange('email')}
                error={errors.email}
                required
              />

              <Input
                label="OTP Code"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={formData.otp}
                onChange={handleInputChange('otp')}
                error={errors.otp}
                maxLength={6}
                required
              />

              <Input
                label="New Password"
                type="password"
                placeholder="Enter new password"
                value={formData.password}
                onChange={handleInputChange('password')}
                error={errors.password}
                required
              />

              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Confirm new password"
                value={formData.passwordConfirmation}
                onChange={handleInputChange('passwordConfirmation')}
                error={errors.passwordConfirmation}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="large"
                loading={isLoading}
                className="w-full"
              >
                Reset Password
              </Button>

              <div className="text-center space-y-2">
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Didn't receive OTP? Send again
                </Link>
                <br />
                <Link
                  to="/login"
                  className="text-sm text-gray-600 hover:text-gray-500 transition-colors duration-200"
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

export default ResetPasswordPage;
