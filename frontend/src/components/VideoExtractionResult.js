import React from 'react';
import Button from './Button';
import Card from './Card';
import {
  MusicalNoteIcon,
  VideoCameraIcon,
  ArrowDownTrayIcon,
  DocumentIcon,
  CogIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const VideoExtractionResult = ({
  status,
  extractionData,
  downloadOptions,
  selectedOption,
  downloadData,
  downloadUrl,
  videoInfo,
  error,
  progress,
  isLoading,
  isPollingExtraction,
  isShowingOptions,
  isTriggeringDownload,
  isPollingDownload,
  isDownloadReady,
  isDownloading,
  hasError,
  canDownload,
  onSelectOption,
  onDownload,
  onReset,
  onCancel,
  formatFileSize,
  formatDuration,
  getTimeUntilExpiration,
  isDownloadExpired,
}) => {
  // Don't render if idle
  if (status === 'idle') {
    return null;
  }

  const getPlatformIcon = platform => {
    const icons = {
      youtube: '🎥',
      tiktok: '🎵',
      instagram: '📷',
      facebook: '👥',
    };
    return icons[platform?.toLowerCase()] || '📱';
  };

  const getStatusMessage = () => {
    if (isLoading) {
      return 'Submitting extraction request...';
    }
    if (isPollingExtraction) {
      const estimatedTime = extractionData?.estimated_processing_time;
      if (estimatedTime) {
        return `Processing video... (estimated ${estimatedTime} seconds)`;
      }
      return 'Processing video...';
    }
    if (isShowingOptions) {
      return 'Choose your download option';
    }
    if (isTriggeringDownload) {
      return 'Preparing download...';
    }
    if (isPollingDownload) {
      return 'Preparing your file...';
    }
    if (isDownloadReady) {
      return 'Download ready!';
    }
    if (hasError) {
      return 'Process failed';
    }
    return 'Processing...';
  };

  const getProgressBarColor = () => {
    if (hasError) return 'bg-gradient-to-r from-red-500 to-red-600';
    if (isDownloadReady)
      return 'bg-gradient-to-r from-green-500 to-emerald-500';
    return 'bg-gradient-to-r from-blue-500 to-cyan-500';
  };

  return (
    <Card className="mt-6" padding="medium">
      <div className="text-center">
        {/* Status Message */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {getStatusMessage()}
          </h3>

          {/* Platform Info */}
          {extractionData && (
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-1">
                <span>{getPlatformIcon(extractionData.platform)}</span>
                <span className="capitalize">{extractionData.platform}</span>
              </div>
            </div>
          )}
        </div>

        {/* Modern Processing Section */}
        {(isLoading ||
          isPollingExtraction ||
          isTriggeringDownload ||
          isPollingDownload) && (
          <div className="mb-8">
            {/* Modern Loading Animation */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                {/* Outer rotating ring */}
                <div className="w-16 h-16 border-4 border-blue-100 rounded-full animate-spin">
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
                </div>
                {/* Inner pulsing dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <CogIcon className="w-6 h-6 text-blue-500 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Modern Progress Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                {/* Background track */}
                <div className="w-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-full h-3 shadow-inner">
                  {/* Progress fill with gradient */}
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden ${getProgressBarColor()}`}
                    style={{ width: `${Math.max(progress, 5)}%` }}
                  >
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  </div>
                </div>

                {/* Progress percentage */}
                <div className="flex justify-center mt-3">
                  <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200">
                    <span className="text-sm font-semibold text-gray-700">
                      {Math.round(progress)}% complete
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modern Error Message */}
        {hasError && (
          <div className="mb-6 p-6 bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 rounded-2xl shadow-sm">
            <div className="flex items-center justify-center space-x-3 text-red-700 mb-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-lg font-semibold">Processing Failed</span>
            </div>
            <p className="text-red-600 text-center font-medium">{error}</p>
          </div>
        )}

        {/* Video Info */}
        {videoInfo && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            {videoInfo.title && (
              <h4 className="font-semibold text-gray-900 truncate mb-2">
                {videoInfo.title}
              </h4>
            )}

            {/* Thumbnail */}
            {videoInfo.thumbnail_url && (
              <div className="mt-3">
                <img
                  src={videoInfo.thumbnail_url}
                  alt="Video thumbnail"
                  className="mx-auto rounded-lg max-w-xs max-h-32 object-cover"
                  onError={e => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Download Options */}
        {isShowingOptions && downloadOptions.length > 0 && (
          <div className="mb-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-4 shadow-sm">
              <div className="flex items-center justify-center space-x-3 text-green-700 mb-8">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <ArrowDownTrayIcon className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-lg font-semibold">
                  Choose Download Option
                </span>
              </div>

              {/* Modern Horizontal Button Layout */}
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                {downloadOptions
                  .sort((a, b) => {
                    // Ensure proper ordering: Audio first, then 144p -> 360p -> 720p -> 1080p+
                    const qualityOrder = {
                      audio: 0,
                      mp3: 0,
                      '144p': 1,
                      '240p': 2,
                      '360p': 3,
                      '480p': 4,
                      '720p': 5,
                      '1080p': 6,
                      '1440p': 7,
                      '2160p': 8,
                      '4k': 8,
                    };

                    const isAudioA =
                      a.quality === 'audio' || a.format === 'mp3';
                    const isAudioB =
                      b.quality === 'audio' || b.format === 'mp3';

                    if (isAudioA && !isAudioB) return -1;
                    if (!isAudioA && isAudioB) return 1;
                    if (isAudioA && isAudioB) return 0;

                    const orderA =
                      qualityOrder[a.quality?.toLowerCase()] ?? 999;
                    const orderB =
                      qualityOrder[b.quality?.toLowerCase()] ?? 999;

                    return orderA - orderB;
                  })
                  .map((option, index) => {
                    const isAudio =
                      option.quality === 'audio' || option.format === 'mp3';
                    const displayLabel = isAudio ? 'Audio' : option.quality;

                    // Get the appropriate icon
                    const IconComponent = isAudio
                      ? MusicalNoteIcon
                      : VideoCameraIcon;

                    // Quality-based styling
                    const getQualityStyle = () => {
                      if (isAudio) {
                        return {
                          gradient: 'from-purple-500 to-pink-500',
                          hover: 'hover:from-purple-600 hover:to-pink-600',
                          ring: 'focus:ring-purple-500',
                          shadow: 'shadow-purple-200',
                        };
                      }

                      const quality = option.quality?.toLowerCase();
                      if (
                        quality?.includes('1080') ||
                        quality?.includes('4k') ||
                        quality?.includes('2160')
                      ) {
                        return {
                          gradient: 'from-red-500 to-orange-500',
                          hover: 'hover:from-red-600 hover:to-orange-600',
                          ring: 'focus:ring-red-500',
                          shadow: 'shadow-red-200',
                        };
                      } else if (quality?.includes('720')) {
                        return {
                          gradient: 'from-blue-500 to-cyan-500',
                          hover: 'hover:from-blue-600 hover:to-cyan-600',
                          ring: 'focus:ring-blue-500',
                          shadow: 'shadow-blue-200',
                        };
                      } else if (
                        quality?.includes('360') ||
                        quality?.includes('480')
                      ) {
                        return {
                          gradient: 'from-green-500 to-teal-500',
                          hover: 'hover:from-green-600 hover:to-teal-600',
                          ring: 'focus:ring-green-500',
                          shadow: 'shadow-green-200',
                        };
                      } else {
                        return {
                          gradient: 'from-gray-500 to-slate-500',
                          hover: 'hover:from-gray-600 hover:to-slate-600',
                          ring: 'focus:ring-gray-500',
                          shadow: 'shadow-gray-200',
                        };
                      }
                    };

                    const style = getQualityStyle();

                    return (
                      <div
                        key={option.id || index}
                        className="flex flex-col items-center group"
                      >
                        {/* Modern Download Button */}
                        <button
                          onClick={() => onSelectOption(option)}
                          className={`
                          relative min-w-[140px] sm:min-w-[160px] lg:min-w-[180px] px-6 py-5
                          bg-gradient-to-br ${style.gradient} ${style.hover}
                          text-white font-bold rounded-2xl
                          transform transition-all duration-300 ease-out
                          hover:scale-105 hover:shadow-2xl ${style.shadow}
                          focus:outline-none focus:ring-4 ${style.ring} focus:ring-opacity-50
                          active:scale-95
                          shadow-xl border border-white/10
                        `}
                        >
                          <div className="flex flex-col items-center space-y-3">
                            <IconComponent className="w-10 h-10 drop-shadow-sm" />
                            <div className="text-center space-y-1">
                              <div className="text-lg font-black tracking-wide text-white drop-shadow-sm">
                                {displayLabel}
                              </div>
                              <div className="text-xs font-bold uppercase tracking-widest bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 shadow-sm">
                                {option.format}
                              </div>
                            </div>
                          </div>

                          {/* Subtle shine effect */}
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                        </button>

                        {/* Enhanced File Size Display */}
                        {option.formatted_file_size && (
                          <div className="mt-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-white/50">
                            <div className="flex items-center justify-center space-x-2 text-sm font-bold text-gray-800">
                              <DocumentIcon className="w-4 h-4 text-gray-600" />
                              <span className="tracking-wide">
                                {option.formatted_file_size}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* Modern Download Ready Section */}
        {isDownloadReady && downloadUrl && (
          <div className="mb-6">
            <div className="relative bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border border-emerald-200 rounded-3xl p-8 mb-4 shadow-xl overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-200/30 to-green-200/30 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-teal-200/30 to-emerald-200/30 rounded-full translate-y-12 -translate-x-12"></div>

              {/* Success Animation */}
              <div className="relative flex flex-col items-center text-center">
                {/* Animated Success Icon */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <CheckCircleIcon className="w-12 h-12 text-white drop-shadow-sm" />
                  </div>
                  {/* Ripple effect */}
                  <div className="absolute inset-0 w-20 h-20 bg-emerald-400/30 rounded-full animate-ping"></div>
                  <div className="absolute inset-2 w-16 h-16 bg-emerald-300/20 rounded-full animate-ping animation-delay-75"></div>
                </div>

                {/* Success Message */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-emerald-800 mb-2">
                    🎉 Download Ready!
                  </h3>
                  <p className="text-emerald-700 font-medium">
                    Your file has been processed successfully
                  </p>
                </div>

                {/* File Information Card */}
                {selectedOption && (
                  <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-4 mb-6 shadow-sm min-w-[280px]">
                    <div className="flex items-center justify-center space-x-3">
                      {/* File Type Icon */}
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                        {selectedOption.quality === 'audio' ||
                        selectedOption.format === 'mp3' ? (
                          <MusicalNoteIcon className="w-6 h-6 text-white" />
                        ) : (
                          <VideoCameraIcon className="w-6 h-6 text-white" />
                        )}
                      </div>

                      {/* File Details */}
                      <div className="text-left">
                        <div className="font-bold text-gray-800">
                          {selectedOption.quality === 'audio' ||
                          selectedOption.format === 'mp3'
                            ? 'Audio File'
                            : `${selectedOption.quality} Video`}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center space-x-2">
                          <span className="bg-gray-100 px-2 py-1 rounded-md font-medium uppercase">
                            {selectedOption.format}
                          </span>
                          {selectedOption.formatted_file_size && (
                            <>
                              <span>•</span>
                              <span className="font-medium">
                                {selectedOption.formatted_file_size}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Modern Download Button */}
                <button
                  onClick={onDownload}
                  disabled={isDownloading}
                  className={`
                    relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600
                    hover:from-emerald-600 hover:to-green-700
                    text-white font-bold text-lg rounded-2xl
                    transform transition-all duration-300 ease-out
                    hover:scale-105 hover:shadow-2xl shadow-emerald-200
                    focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:ring-opacity-50
                    active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed
                    min-w-[200px] shadow-xl
                    ${isDownloading ? 'animate-pulse' : ''}
                  `}
                >
                  <div className="flex items-center justify-center space-x-3">
                    {isDownloading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Downloading to Computer...</span>
                      </>
                    ) : (
                      <>
                        <ArrowDownTrayIcon className="w-6 h-6" />
                        <span>Download Now</span>
                      </>
                    )}
                  </div>

                  {/* Button shine effect */}
                  {!isDownloading && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {(isLoading ||
            isPollingExtraction ||
            isTriggeringDownload ||
            isPollingDownload) && (
            <Button
              variant="secondary"
              size="medium"
              onClick={onCancel}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          )}

          {(hasError || isDownloadReady) && (
            <Button
              variant="primary"
              size="medium"
              onClick={onReset}
              className="w-full sm:w-auto"
            >
              Extract Another Video
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default VideoExtractionResult;
