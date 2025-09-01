import { useSettingByKey } from '../hooks/useSettings';

const Logo = ({ size = 'medium', showText = true, className = '' }) => {
  const { value: siteName } = useSettingByKey('site_name', false); // Don't auto-fetch
  const { value: logoPath } = useSettingByKey('logo_path', false); // Don't auto-fetch
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-12 w-12',
    large: 'h-16 w-16',
    xlarge: 'h-20 w-20',
  };

  const textSizeClasses = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl',
    xlarge: 'text-3xl',
  };

  return (
    <div className={`flex items-center ${className}`}>
      {logoPath ? (
        <img
          src={logoPath}
          alt={siteName || 'Logo'}
          className={`${sizeClasses[size]} object-contain`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold ${textSizeClasses[size]}`}
        >
          📥
        </div>
      )}
      {showText && (
        <span
          className={`ml-3 font-bold text-gray-900 ${textSizeClasses[size]}`}
        >
          {siteName || 'Social Downloader'}
        </span>
      )}
    </div>
  );
};

export default Logo;
