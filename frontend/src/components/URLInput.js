import { useState } from 'react';
import { URL_PATTERNS } from '../constants';
import {
  LinkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

const URLInput = ({ value, onChange, onValidation, className = '' }) => {
  const [error, setError] = useState('');

  const validateURL = url => {
    if (!url.trim()) {
      setError('');
      if (onValidation) onValidation(false, '');
      return false;
    }

    const isValid = Object.values(URL_PATTERNS).some(pattern =>
      pattern.test(url)
    );

    if (!isValid) {
      const errorMsg =
        'Please enter a valid URL from YouTube, TikTok, Instagram, or Facebook';
      setError(errorMsg);
      if (onValidation) onValidation(false, errorMsg);
      return false;
    }

    setError('');
    if (onValidation) onValidation(true, '');
    return true;
  };

  const handleChange = e => {
    const newValue = e.target.value;
    if (onChange) {
      onChange(newValue);
    }

    // Validate after a short delay to avoid constant validation while typing
    setTimeout(() => validateURL(newValue), 500);
  };

  const handlePaste = e => {
    // Allow paste and then validate
    setTimeout(() => {
      const pastedValue = e.target.value;
      validateURL(pastedValue);
    }, 100);
  };

  const getValidationIcon = () => {
    if (!value.trim()) return null;
    if (error) {
      return <ExclamationCircleIcon className="w-6 h-6 text-red-500" />;
    }
    return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
  };

  const getInputBorderStyle = () => {
    if (!value.trim())
      return 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
    if (error) return 'border-red-400 focus:border-red-500 focus:ring-red-500';
    return 'border-green-400 focus:border-green-500 focus:ring-green-500';
  };

  return (
    <div className={className}>
      {/* Modern URL Input Container */}
      <div className="relative">
        {/* Input Field */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <LinkIcon className="w-6 h-6 text-gray-400" />
          </div>

          <input
            type="url"
            placeholder="Paste your video URL here..."
            value={value}
            onChange={handleChange}
            onPaste={handlePaste}
            className={`
              w-full pl-12 pr-12 py-4 sm:py-5
              text-base sm:text-lg font-medium
              bg-white border-2 rounded-2xl
              transition-all duration-300 ease-out
              focus:outline-none focus:ring-4 focus:ring-opacity-20
              placeholder:text-gray-400 placeholder:font-normal
              shadow-sm hover:shadow-md focus:shadow-lg
              ${getInputBorderStyle()}
            `}
          />

          {/* Validation Icon */}
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            {getValidationIcon()}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center space-x-2">
              <ExclamationCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {value.trim() && !error && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
              <p className="text-sm font-medium text-green-700">
                Valid URL detected! Ready to download.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modern Helper Text */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500 font-medium">
          Supports video URLs from popular platforms
        </p>
      </div>
    </div>
  );
};

export default URLInput;
