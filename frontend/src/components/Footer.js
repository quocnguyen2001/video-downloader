import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useSettings } from '../hooks/useSettings';

const Footer = () => {
  const { settings } = useSettings(false); // Don't auto-fetch, rely on App.js to fetch
  const currentYear = new Date().getFullYear();

  // Use settings values with fallbacks
  const siteDescription =
    settings?.site_description ||
    'Download videos from your favorite social media platforms quickly and easily. Support for YouTube, TikTok, Instagram, and Facebook.';
  const copyrightText = settings?.copyright_text || 'All rights reserved.';
  const copyrightYear = settings?.copyright_year || currentYear;
  const termsUrl = settings?.terms_of_service_url;
  const privacyUrl = settings?.privacy_policy_url;
  const supportEmail = settings?.support_email;

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <Logo size="small" />
            <p className="mt-4 text-gray-600 text-sm max-w-md">
              {siteDescription}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200"
                >
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Support
            </h3>
            <ul className="mt-4 space-y-2">
              {supportEmail && (
                <li>
                  <a
                    href={`mailto:${supportEmail}`}
                    className="text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200"
                  >
                    Contact Support
                  </a>
                </li>
              )}
              {privacyUrl && (
                <li>
                  <a
                    href={privacyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200"
                  >
                    Privacy Policy
                  </a>
                </li>
              )}
              {termsUrl && (
                <li>
                  <a
                    href={termsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200"
                  >
                    Terms of Service
                  </a>
                </li>
              )}
              {!supportEmail && !privacyUrl && !termsUrl && (
                <li>
                  <span className="text-gray-600 text-sm">Help Center</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            © {copyrightYear} {settings?.site_name || 'Social Downloader'}.{' '}
            {copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
