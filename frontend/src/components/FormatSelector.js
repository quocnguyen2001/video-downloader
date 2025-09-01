import { FORMAT_OPTIONS, DEFAULT_FORMAT } from '../constants';

const FormatSelector = ({
  selectedFormat = DEFAULT_FORMAT,
  onFormatChange,
  className = '',
}) => {
  const handleFormatChange = format => {
    if (onFormatChange) {
      onFormatChange(format);
    }
  };

  return (
    <div className={className}>
      <h3 className="text-left text-sm font-medium text-gray-700 mb-3">
        File Format
      </h3>
      <div className="space-y-2">
        {FORMAT_OPTIONS.map(option => (
          <label
            key={option.value}
            className="flex items-center p-2 sm:p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200"
          >
            <input
              type="radio"
              name="format"
              value={option.value}
              checked={selectedFormat === option.value}
              onChange={() => handleFormatChange(option.value)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <div className="ml-2 sm:ml-3 flex-1">
              <div className="text-xs sm:text-sm font-medium text-gray-900">
                {option.label}
              </div>
              <div className="text-xs text-gray-500 hidden sm:block">
                {option.description}
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default FormatSelector;
