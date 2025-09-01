import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Logo from '../components/Logo';
import { useAuth } from '../hooks/useAuth';
import { usePageMeta } from '../hooks/useMetaTags';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  // Set page-specific meta tags
  usePageMeta(
    'Register - Create your account',
    'Create your account to unlock premium features and unlimited downloads.',
    'register, sign up, create account'
  );

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      // Prepare data for API (combine first and last name)
      const registrationData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };

      const result = await register(registrationData);

      if (result.success) {
        // Don't clear form - let the redirect handle it
        // Redirect to dashboard after successful registration
        navigate('/dashboard', { replace: true });
      } else {
        // Handle validation errors from API if available
        if (result.validationErrors) {
          const apiErrors = {};
          Object.keys(result.validationErrors).forEach(field => {
            const errorArray = result.validationErrors[field];
            if (Array.isArray(errorArray) && errorArray.length > 0) {
              // Map API field names to form field names
              let formField = field;
              if (field === 'name') {
                // If there's a name error, show it for firstName field
                formField = 'firstName';
              }
              apiErrors[formField] = errorArray[0];
            }
          });
          setErrors(apiErrors);
        }
        // Keep the form data intact so user doesn't have to re-enter
        // Toast notification is already shown by useAuth hook
      }
    } catch (error) {
      // This catch block should rarely be reached since useAuth handles errors
      console.error('Unexpected registration error:', error);
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
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>

          <Card padding="large">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First name"
                  type="text"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleInputChange('firstName')}
                  error={errors.firstName}
                  required
                />

                <Input
                  label="Last name"
                  type="text"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleInputChange('lastName')}
                  error={errors.lastName}
                  required
                />
              </div>

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
                label="Password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange('password')}
                error={errors.password}
                required
              />

              <Input
                label="Confirm password"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                error={errors.confirmPassword}
                required
              />

              <div className="flex items-center">
                <input
                  id="agree-terms"
                  name="agree-terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="agree-terms"
                  className="ml-2 block text-sm text-gray-900"
                >
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="large"
                loading={isLoading}
                className="w-full"
              >
                Create account
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;
