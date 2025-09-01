import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/auth';
import { handleApiError } from '../utils/errorHandler';

const ProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);

  // Profile data initialized from user context
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
  });

  // Initialize profile data from user context
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [preferences, setPreferences] = useState({
    defaultQuality: '720p',
    defaultFormat: 'mp4',
    emailNotifications: true,
    downloadNotifications: false,
  });

  const [errors, setErrors] = useState({});

  const handleProfileChange = field => e => {
    setProfileData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handlePasswordChange = field => e => {
    setPasswordData(prev => ({
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

  const handlePreferenceChange = field => e => {
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setPreferences(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProfileSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({}); // Clear any previous errors

    try {
      // Call the profile update API
      const { user: updatedUser, message } =
        await authService.updateProfile(profileData);

      // Show success toast notification
      toast.success(message || 'Profile updated successfully!');

      // Form data is preserved - no need to clear it
      // The updated user data is automatically stored in localStorage by the service
    } catch (error) {
      // Handle API errors with toast notifications
      const errorMessage = handleApiError(error, 'Failed to update profile');

      // Handle validation errors
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }

      // Show error toast
      toast.error(errorMessage);
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async e => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    // Client-side validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setErrors({ newPassword: 'Password must be at least 6 characters' });
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement password change logic
      console.log('Password change request');

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Only clear password form on successful submission (for security)
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      // Show success toast notification
      toast.success('Password updated successfully!');
    } catch (error) {
      // Handle API errors with toast notifications
      // Keep form data so user doesn't have to re-enter everything
      toast.error('Failed to update password. Please try again.');
      console.error('Password update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferencesSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({}); // Clear any previous errors

    try {
      // TODO: Implement preferences update logic
      console.log('Preferences update:', preferences);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success toast notification
      toast.success('Preferences updated successfully!');

      // Form data is preserved - no need to clear preferences
    } catch (error) {
      // Handle API errors with toast notifications
      toast.error('Failed to update preferences. Please try again.');
      console.error('Preferences update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile Information' },
    { id: 'password', label: 'Change Password' },
    { id: 'preferences', label: 'Preferences' },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account information and preferences
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Profile Information
            </h2>
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <Input
                label="Full Name"
                value={profileData.name}
                onChange={handleProfileChange('name')}
                error={errors.name?.[0]}
                required
              />

              <Input
                label="Email Address"
                type="email"
                value={profileData.email}
                onChange={handleProfileChange('email')}
                error={errors.email?.[0]}
                required
              />

              <div className="flex justify-end">
                <Button type="submit" variant="primary" loading={isLoading}>
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        )}

        {activeTab === 'password' && (
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Change Password
            </h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <Input
                label="Current Password"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange('currentPassword')}
                required
              />

              <Input
                label="New Password"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange('newPassword')}
                error={errors.newPassword}
                required
              />

              <Input
                label="Confirm New Password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange('confirmPassword')}
                error={errors.confirmPassword}
                required
              />

              <div className="flex justify-end">
                <Button type="submit" variant="primary" loading={isLoading}>
                  Update Password
                </Button>
              </div>
            </form>
          </Card>
        )}

        {activeTab === 'preferences' && (
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Download Preferences
            </h2>
            <form onSubmit={handlePreferencesSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-left text-sm font-medium text-gray-700 mb-2">
                    Default Quality
                  </label>
                  <select
                    value={preferences.defaultQuality}
                    onChange={handlePreferenceChange('defaultQuality')}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="360p">360p (Standard)</option>
                    <option value="720p">720p (HD)</option>
                    <option value="1080p">1080p (Full HD)</option>
                    <option value="4k">4K (Ultra HD)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-left text-sm font-medium text-gray-700 mb-2">
                    Default Format
                  </label>
                  <select
                    value={preferences.defaultFormat}
                    onChange={handlePreferenceChange('defaultFormat')}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="mp4">MP4 (Video)</option>
                    <option value="mp3">MP3 (Audio)</option>
                    <option value="webm">WebM (Video)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Notifications
                </h3>

                <div className="flex items-center">
                  <input
                    id="email-notifications"
                    type="checkbox"
                    checked={preferences.emailNotifications}
                    onChange={handlePreferenceChange('emailNotifications')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="email-notifications"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Email notifications for account updates
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="download-notifications"
                    type="checkbox"
                    checked={preferences.downloadNotifications}
                    onChange={handlePreferenceChange('downloadNotifications')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="download-notifications"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Browser notifications for download completion
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" variant="primary" loading={isLoading}>
                  Save Preferences
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default ProfilePage;
