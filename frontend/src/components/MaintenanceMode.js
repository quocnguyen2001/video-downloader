import Logo from './Logo';
import Card from './Card';
import { useSettings } from '../hooks/useSettings';
import { useMetaTags } from '../hooks/useMetaTags';

const MaintenanceMode = () => {
  const { settings } = useSettings();

  // Set maintenance mode meta tags
  useMetaTags({
    title: `Maintenance Mode - ${settings?.site_name || 'Social Downloader'}`,
    description:
      settings?.maintenance_message ||
      'We are currently performing maintenance. Please check back later.',
  });

  const maintenanceMessage =
    settings?.maintenance_message ||
    'We are currently performing maintenance. Please check back later.';
  const siteName = settings?.site_name || 'Social Downloader';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Card className="text-center" padding="large">
          {/* Logo */}
          <div className="mb-8">
            <Logo size="large" className="justify-center" />
          </div>

          {/* Maintenance Icon */}
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Maintenance Mode
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            {maintenanceMessage}
          </p>

          {/* Additional Info */}
          <div className="text-sm text-gray-500">
            <p>We apologize for any inconvenience.</p>
            <p className="mt-2">
              Please try again later or contact support if you need immediate
              assistance.
            </p>
          </div>

          {/* Support Email Link */}
          {settings?.support_email && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <a
                href={`mailto:${settings.support_email}`}
                className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Contact Support
              </a>
            </div>
          )}
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceMode;
