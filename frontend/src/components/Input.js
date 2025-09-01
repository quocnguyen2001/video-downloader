const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  className = '',
  size = 'medium',
  ...props
}) => {
  const baseClasses =
    'w-full border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed';

  const sizeClasses = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base',
    large: 'px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg',
  };

  const errorClasses = error
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
    : 'border-gray-300';

  const inputClasses = `${baseClasses} ${sizeClasses[size]} ${errorClasses} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-left text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={inputClasses}
        {...props}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
