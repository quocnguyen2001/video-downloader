// Supported social media platforms
export const SUPPORTED_PLATFORMS = [
  {
    name: 'YouTube',
    icon: 'youtube',
    color: 'red',
    bgColor: 'bg-red-50',
    textColor: 'text-red-600',
    borderColor: 'border-red-200',
    gradient: 'from-red-500 to-red-600',
    hoverGradient: 'hover:from-red-600 hover:to-red-700',
  },
  {
    name: 'TikTok',
    icon: 'tiktok',
    color: 'black',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-800',
    borderColor: 'border-gray-200',
    gradient: 'from-gray-800 to-black',
    hoverGradient: 'hover:from-gray-900 hover:to-black',
  },
  {
    name: 'Instagram',
    icon: 'instagram',
    color: 'purple',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    borderColor: 'border-purple-200',
    gradient: 'from-purple-500 to-pink-500',
    hoverGradient: 'hover:from-purple-600 hover:to-pink-600',
  },
  {
    name: 'Facebook',
    icon: 'facebook',
    color: 'blue',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    gradient: 'from-blue-500 to-blue-600',
    hoverGradient: 'hover:from-blue-600 hover:to-blue-700',
  },
];

// Video quality options
export const QUALITY_OPTIONS = [
  {
    value: '360p',
    label: '360p (Standard)',
    description: 'Good for mobile viewing',
  },
  { value: '720p', label: '720p (HD)', description: 'High definition quality' },
  {
    value: '1080p',
    label: '1080p (Full HD)',
    description: 'Full high definition',
  },
  { value: '4k', label: '4K (Ultra HD)', description: 'Ultra high definition' },
];

// File format options
export const FORMAT_OPTIONS = [
  {
    value: 'mp4',
    label: 'MP4 (Video)',
    type: 'video',
    description: 'Most compatible video format',
  },
  {
    value: 'mp3',
    label: 'MP3 (Audio)',
    type: 'audio',
    description: 'Audio only, smaller file size',
  },
  {
    value: 'webm',
    label: 'WebM (Video)',
    type: 'video',
    description: 'Web-optimized video format',
  },
];

// Navigation items
export const NAV_ITEMS = [
  { path: '/', label: 'Home', public: true },
  { path: '/pricing', label: 'Pricing', public: true },
  { path: '/dashboard', label: 'Dashboard', auth: true },
  { path: '/profile', label: 'Profile', auth: true },
  { path: '/login', label: 'Login', guest: true },
  { path: '/register', label: 'Register', guest: true },
];

// Default form values
export const DEFAULT_QUALITY = '720p';
export const DEFAULT_FORMAT = 'mp4';

// URL validation patterns
export const URL_PATTERNS = {
  youtube: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/,
  tiktok: /^(https?:\/\/)?(www\.)?tiktok\.com\/.+/,
  instagram: /^(https?:\/\/)?(www\.)?instagram\.com\/.+/,
  facebook: /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.watch)\/.+/,
};
