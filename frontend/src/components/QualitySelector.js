import { QUALITY_OPTIONS, DEFAULT_QUALITY } from '../constants';

const QualitySelector = ({
  selectedQuality = DEFAULT_QUALITY,
  onQualityChange,
  className = '',
}) => {
  const handleQualityChange = quality => {
    if (onQualityChange) {
      onQualityChange(quality);
    }
  };

  return (
    <div className={className}>
      <h3 className="text-left text-sm font-medium text-gray-700 mb-3">
        Video Quality
      </h3>
      <div className="space-y-2">
        {QUALITY_OPTIONS.map(option => (
          <label
            key={option.value}
            className="flex items-center p-2 sm:p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200"
          >
            <input
              type="radio"
              name="quality"
              value={option.value}
              checked={selectedQuality === option.value}
              onChange={() => handleQualityChange(option.value)}
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

export default QualitySelector;
