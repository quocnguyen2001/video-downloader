import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import URLInput from '../components/URLInput';
import PlatformIndicator from '../components/PlatformIndicator';
import VideoExtractionResult from '../components/VideoExtractionResult';
import MembershipPlansGrid from '../components/MembershipPlansGrid';
import { useFeaturedMembershipPlans } from '../hooks/useMembershipPlans';
import { useSettings } from '../hooks/useSettings';
import { useMetaTags } from '../hooks/useMetaTags';
import { useVideoExtraction } from '../hooks/useVideoExtraction';
import { ArrowDownTrayIcon, SparklesIcon } from '@heroicons/react/24/outline';

const HomePage = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [isValidURL, setIsValidURL] = useState(false);

  // Fetch featured membership plans and settings
  const { featuredPlans, isLoading: plansLoading } =
    useFeaturedMembershipPlans();
  const { settings } = useSettings(false); // Don't auto-fetch, rely on App.js to fetch

  // Video extraction hook
  const {
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
    extractVideo,
    selectDownloadOption,
    cancelExtraction,
    reset,
    downloadVideo,
    formatFileSize,
    formatDuration,
    getTimeUntilExpiration,
    isDownloadExpired,
  } = useVideoExtraction();

  // Set up meta tags for homepage
  useMetaTags();

  const handleURLValidation = (isValid, errorMessage) => {
    setIsValidURL(isValid);
  };

  const handleDownload = async () => {
    if (!isValidURL || !url.trim()) {
      toast.error('Please enter a valid video URL');
      return;
    }

    // Start video extraction (only URL needed)
    await extractVideo(url);
  };

  const handleReset = () => {
    reset();
    setUrl('');
    setIsValidURL(false);
  };

  const handleSelectPlan = plan => {
    console.log('Selected plan:', plan);
    toast.success(`You selected the ${plan.name} plan!`);
    // TODO: Implement plan selection logic (redirect to payment, etc.)
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              {settings?.meta_title || 'Download Videos from Social Media'}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              {settings?.meta_description ||
                'Fast, free, and easy video downloads from YouTube, TikTok, Instagram, and Facebook. No registration required.'}
            </p>
          </div>

          {/* Main Download Interface */}
          <Card className="max-w-4xl mx-auto" padding="medium">
            <URLInput
              value={url}
              onChange={setUrl}
              onValidation={handleURLValidation}
              className="mb-6 sm:mb-8"
            />

            <PlatformIndicator className="mb-6 sm:mb-8" />

            {/* Modern Download Button */}
            <div className="text-center">
              <div className="flex justify-center">
                <button
                  onClick={handleDownload}
                  disabled={
                    !isValidURL ||
                    !url.trim() ||
                    isLoading ||
                    isPollingExtraction ||
                    isTriggeringDownload ||
                    isPollingDownload
                  }
                  className={`
                    relative px-8 py-4 sm:px-10 sm:py-5
                    bg-gradient-to-r from-blue-600 to-purple-600
                    hover:from-blue-700 hover:to-purple-700
                    text-white font-bold text-lg sm:text-xl rounded-2xl
                    transform transition-all duration-300 ease-out
                    hover:scale-105 hover:shadow-2xl shadow-blue-200
                    focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50
                    active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                    disabled:hover:scale-100 disabled:hover:shadow-lg
                    min-w-[250px] sm:min-w-[300px] shadow-xl
                    ${isLoading || isPollingExtraction || isTriggeringDownload || isPollingDownload ? 'animate-pulse' : ''}
                  `}
                >
                  <div className="flex items-center justify-center space-x-3">
                    {isLoading ||
                    isPollingExtraction ||
                    isTriggeringDownload ||
                    isPollingDownload ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        <span>
                          {isLoading
                            ? 'Submitting...'
                            : isPollingExtraction
                              ? 'Processing...'
                              : isTriggeringDownload
                                ? 'Preparing...'
                                : 'Downloading...'}
                        </span>
                      </>
                    ) : (
                      <>
                        <ArrowDownTrayIcon className="w-6 h-6" />
                        <span>Download Video</span>
                        <SparklesIcon className="w-5 h-5 opacity-75" />
                      </>
                    )}
                  </div>

                  {/* Button shine effect */}
                  {!(
                    isLoading ||
                    isPollingExtraction ||
                    isTriggeringDownload ||
                    isPollingDownload
                  ) && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                  )}
                </button>
              </div>

              {/* Additional Info */}
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  Free • No registration required • High quality downloads
                </p>
              </div>
            </div>
          </Card>

          {/* Video Extraction Result */}
          <VideoExtractionResult
            status={status}
            extractionData={extractionData}
            downloadOptions={downloadOptions}
            selectedOption={selectedOption}
            downloadData={downloadData}
            downloadUrl={downloadUrl}
            videoInfo={videoInfo}
            error={error}
            progress={progress}
            isLoading={isLoading}
            isPollingExtraction={isPollingExtraction}
            isShowingOptions={isShowingOptions}
            isTriggeringDownload={isTriggeringDownload}
            isPollingDownload={isPollingDownload}
            isDownloadReady={isDownloadReady}
            isDownloading={isDownloading}
            hasError={hasError}
            canDownload={canDownload}
            onSelectOption={selectDownloadOption}
            onDownload={downloadVideo}
            onReset={handleReset}
            onCancel={cancelExtraction}
            formatFileSize={formatFileSize}
            formatDuration={formatDuration}
            getTimeUntilExpiration={getTimeUntilExpiration}
            isDownloadExpired={isDownloadExpired}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Downloader?
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Simple, fast, and reliable video downloading experience
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="text-center" hover>
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Lightning Fast
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Download videos in seconds with our optimized servers
              </p>
            </Card>

            <Card className="text-center" hover>
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Secure & Private
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Your downloads are private and secure. No data stored.
              </p>
            </Card>

            <Card className="text-center" hover>
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                All Devices
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Works perfectly on desktop, tablet, and mobile devices
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Membership Plans Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Unlock premium features and unlimited downloads with our
              membership plans
            </p>
          </div>

          {plansLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading plans...</p>
            </div>
          ) : featuredPlans.length > 0 ? (
            <>
              <MembershipPlansGrid
                plans={featuredPlans}
                onSelectPlan={handleSelectPlan}
                maxPlans={3}
                className="mb-8"
              />
              <div className="text-center">
                <Button
                  variant="secondary"
                  size="medium"
                  onClick={() => navigate('/pricing')}
                >
                  View All Plans
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">
                No featured plans available at the moment.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
