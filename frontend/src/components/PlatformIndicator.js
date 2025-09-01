import { SUPPORTED_PLATFORMS } from '../constants';
import PlatformIcon from './PlatformIcon';

const PlatformIndicator = ({ className = '' }) => {
  return (
    <div className={`${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">
          Supported Platforms
        </h3>
        <p className="text-sm text-gray-600">
          Download videos from your favorite social media platforms
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {SUPPORTED_PLATFORMS.map(platform => (
          <div key={platform.name} className="group relative overflow-hidden">
            {/* Modern Platform Card */}
            <div
              className={`
              relative p-3 sm:p-4 rounded-2xl border-2
              bg-gradient-to-br ${platform.gradient}
              ${platform.hoverGradient}
              text-white font-bold
              transform transition-all duration-300 ease-out
              hover:scale-105 hover:shadow-xl shadow-lg
              focus:outline-none focus:ring-4 focus:ring-opacity-50
              cursor-pointer
            `}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Content */}
              <div className="relative flex flex-col items-center space-y-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8">
                  <PlatformIcon
                    platform={platform.icon}
                    size="medium"
                    className="text-white drop-shadow-sm"
                  />
                </div>
                <span className="text-xs sm:text-sm font-bold tracking-wide">
                  {platform.name}
                </span>
              </div>

              {/* Shine Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">More platforms coming soon! 🚀</p>
      </div>
    </div>
  );
};

export default PlatformIndicator;
