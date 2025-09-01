import { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import { videoExtractionService } from '../services/videoExtraction';
import { handleApiError } from '../utils/errorHandler';
import { useAuth } from './useAuth';

// Extraction status constants
export const EXTRACTION_STATUS = {
  IDLE: 'idle',
  SUBMITTING: 'submitting',
  POLLING_EXTRACTION: 'polling_extraction',
  SHOWING_OPTIONS: 'showing_options',
  TRIGGERING_DOWNLOAD: 'triggering_download',
  POLLING_DOWNLOAD: 'polling_download',
  DOWNLOAD_READY: 'download_ready',
  ERROR: 'error',
  CANCELLED: 'cancelled',
};

// Polling configuration
const POLLING_INTERVAL = 1000; // 1 second as specified in requirements
const MAX_POLLING_ATTEMPTS = 300; // 5 minutes maximum
const POLLING_TIMEOUT = 300000; // 5 minutes in milliseconds

export const useVideoExtraction = () => {
  const { isAuthenticated } = useAuth();

  // State management
  const [status, setStatus] = useState(EXTRACTION_STATUS.IDLE);
  const [extractionData, setExtractionData] = useState(null);
  const [downloadOptions, setDownloadOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [downloadData, setDownloadData] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [videoInfo, setVideoInfo] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  // Refs for cleanup
  const extractionPollingRef = useRef(null);
  const downloadPollingRef = useRef(null);
  const pollingTimeoutRef = useRef(null);
  const extractionAttemptsRef = useRef(0);
  const downloadAttemptsRef = useRef(0);
  const startTimeRef = useRef(null);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (extractionPollingRef.current) {
      clearTimeout(extractionPollingRef.current);
      extractionPollingRef.current = null;
    }
    if (downloadPollingRef.current) {
      clearTimeout(downloadPollingRef.current);
      downloadPollingRef.current = null;
    }
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
      pollingTimeoutRef.current = null;
    }
    extractionAttemptsRef.current = 0;
    downloadAttemptsRef.current = 0;
    startTimeRef.current = null;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Calculate progress based on estimated time
  const updateProgress = useCallback(estimatedTime => {
    if (!startTimeRef.current || !estimatedTime) return;

    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const progressPercent = Math.min((elapsed / estimatedTime) * 100, 95); // Cap at 95% until completion
    setProgress(progressPercent);
  }, []);

  // Polling function for extraction status
  const pollExtractionStatus = useCallback(
    async (sessionId, estimatedTime) => {
      try {
        extractionAttemptsRef.current += 1;

        // Check if we've exceeded maximum attempts
        if (extractionAttemptsRef.current > MAX_POLLING_ATTEMPTS) {
          throw new Error('Extraction timeout. Please try again.');
        }

        const response = await videoExtractionService.pollStatus(sessionId);
        const statusData = response.data;

        // Update progress
        updateProgress(estimatedTime);

        // Check for completion statuses
        if (
          statusData.status === 'ready_for_download' ||
          statusData.status === 'metadata_fetched'
        ) {
          cleanup();
          setStatus(EXTRACTION_STATUS.SHOWING_OPTIONS);

          // Sort and set download options
          const sortedOptions = videoExtractionService.sortDownloadOptions(
            statusData.download_options || []
          );
          setDownloadOptions(sortedOptions);

          // Set video info if available
          if (statusData.video_info) {
            setVideoInfo(statusData.video_info);
          }

          setProgress(100);
          toast.success(
            'Video extraction completed! Choose your download option.'
          );
          return;
        }

        if (statusData.status === 'failed' || statusData.status === 'error') {
          cleanup();
          setStatus(EXTRACTION_STATUS.ERROR);
          setError('Video extraction failed. Please try again.');
          toast.error('Video extraction failed');
          return;
        }

        // Continue polling if still pending/processing/metadata_fetching
        if (
          statusData.status === 'pending' ||
          statusData.status === 'processing' ||
          statusData.status === 'fetching_metadata'
        ) {
          // Schedule next poll
          extractionPollingRef.current = setTimeout(() => {
            pollExtractionStatus(sessionId, estimatedTime);
          }, POLLING_INTERVAL);
        }
      } catch (error) {
        cleanup();
        setStatus(EXTRACTION_STATUS.ERROR);
        const errorMessage = handleApiError(
          error,
          'Failed to check extraction status'
        );
        setError(errorMessage);
      }
    },
    [cleanup, updateProgress]
  );

  // Polling function for download status
  const pollDownloadStatus = useCallback(
    async (downloadOptionId, estimatedTime) => {
      try {
        downloadAttemptsRef.current += 1;

        // Check if we've exceeded maximum attempts
        if (downloadAttemptsRef.current > MAX_POLLING_ATTEMPTS) {
          throw new Error('Download timeout. Please try again.');
        }

        const response =
          await videoExtractionService.pollDownloadStatus(downloadOptionId);
        const statusData = response.data;

        // Update progress based on estimated time
        if (estimatedTime) {
          const elapsed = (Date.now() - startTimeRef.current) / 1000;
          const progressPercent = Math.min((elapsed / estimatedTime) * 100, 95);
          setProgress(progressPercent);
        }

        // Check for completion
        if (statusData.status === 'downloaded') {
          cleanup();
          setStatus(EXTRACTION_STATUS.DOWNLOAD_READY);
          setDownloadUrl(statusData.download_url);
          setProgress(100);
          toast.success('Download is ready!');
          return;
        }

        if (statusData.status === 'failed' || statusData.status === 'error') {
          cleanup();
          setStatus(EXTRACTION_STATUS.ERROR);
          setError('Download preparation failed. Please try again.');
          toast.error('Download preparation failed');
          return;
        }

        // Continue polling if still processing
        if (statusData.status === 'cdn' || statusData.status === 'processing') {
          // Schedule next poll
          downloadPollingRef.current = setTimeout(() => {
            pollDownloadStatus(downloadOptionId, estimatedTime);
          }, POLLING_INTERVAL);
        }
      } catch (error) {
        cleanup();
        setStatus(EXTRACTION_STATUS.ERROR);
        const errorMessage = handleApiError(
          error,
          'Failed to check download status'
        );
        setError(errorMessage);
      }
    },
    [cleanup]
  );

  // Start extraction
  const extractVideo = useCallback(
    async url => {
      try {
        // Reset state
        setStatus(EXTRACTION_STATUS.SUBMITTING);
        setExtractionData(null);
        setDownloadOptions([]);
        setSelectedOption(null);
        setDownloadData(null);
        setDownloadUrl(null);
        setVideoInfo(null);
        setError(null);
        setProgress(0);
        cleanup();

        // Submit extraction request (only URL needed)
        const response = await videoExtractionService.extractVideo(
          url,
          isAuthenticated
        );

        const data = response.data;
        setExtractionData(data);
        setStatus(EXTRACTION_STATUS.POLLING_EXTRACTION);
        startTimeRef.current = Date.now();

        // Show initial success message
        toast.success(
          response.message || 'Extraction request submitted successfully'
        );

        // Start polling
        const estimatedTime = data.estimated_processing_time || 30;

        // Set overall timeout
        pollingTimeoutRef.current = setTimeout(() => {
          cleanup();
          setStatus(EXTRACTION_STATUS.ERROR);
          setError('Extraction timeout. Please try again.');
          toast.error('Extraction took too long. Please try again.');
        }, POLLING_TIMEOUT);

        // Start polling immediately
        pollExtractionStatus(data.session_id, estimatedTime);
      } catch (error) {
        cleanup();
        setStatus(EXTRACTION_STATUS.ERROR);

        // Handle rate limit errors specially
        if (error.isRateLimit) {
          setError('Rate limit exceeded. Please wait before trying again.');
          toast.error('Rate limit exceeded. Please wait before trying again.');
        } else {
          const errorMessage = handleApiError(
            error,
            'Failed to start video extraction'
          );
          setError(errorMessage);
        }
      }
    },
    [isAuthenticated, cleanup, pollExtractionStatus]
  );

  // Select download option and trigger download
  const selectDownloadOption = useCallback(
    async option => {
      try {
        setSelectedOption(option);
        setStatus(EXTRACTION_STATUS.TRIGGERING_DOWNLOAD);
        setProgress(0);

        // Trigger download
        const response = await videoExtractionService.triggerDownload(
          option.id
        );
        const data = response.data;

        setDownloadData(data);
        setStatus(EXTRACTION_STATUS.POLLING_DOWNLOAD);
        startTimeRef.current = Date.now();

        toast.success('Download triggered! Preparing your file...');

        // Start polling download status
        const estimatedTime = option.estimated_download_time || 30;

        // Set timeout for download polling
        pollingTimeoutRef.current = setTimeout(() => {
          cleanup();
          setStatus(EXTRACTION_STATUS.ERROR);
          setError('Download timeout. Please try again.');
          toast.error('Download took too long. Please try again.');
        }, POLLING_TIMEOUT);

        // Start download polling
        pollDownloadStatus(data.download_option_id, estimatedTime);
      } catch (error) {
        cleanup();
        setStatus(EXTRACTION_STATUS.ERROR);
        const errorMessage = handleApiError(
          error,
          'Failed to trigger download'
        );
        setError(errorMessage);
      }
    },
    [cleanup, pollDownloadStatus]
  );

  // Cancel extraction
  const cancelExtraction = useCallback(() => {
    cleanup();
    setStatus(EXTRACTION_STATUS.CANCELLED);
    setProgress(0);
    toast.info('Extraction cancelled');
  }, [cleanup]);

  // Reset to idle state
  const reset = useCallback(() => {
    cleanup();
    setStatus(EXTRACTION_STATUS.IDLE);
    setExtractionData(null);
    setDownloadOptions([]);
    setSelectedOption(null);
    setDownloadData(null);
    setDownloadUrl(null);
    setVideoInfo(null);
    setError(null);
    setProgress(0);
  }, [cleanup]);

  // Download video using direct URL with programmatic anchor element
  const downloadVideo = useCallback(async () => {
    if (!downloadUrl) {
      toast.error('Download URL not available');
      return;
    }

    // Prevent multiple simultaneous downloads
    if (isDownloading) {
      toast.error('Download already in progress. Please wait...');
      return;
    }

    try {
      // Set downloading state and show loading toast
      setIsDownloading(true);
      const loadingToast = toast.loading(
        'Downloading file to your computer...',
        {
          duration: Infinity, // Keep showing until we dismiss it
        }
      );

      // Generate filename
      const title = videoInfo?.title || 'video';
      const format = selectedOption?.format || 'mp4';
      const sanitizedTitle = title.replace(/[<>:"/\\|?*]/g, '_');
      const filename = `${sanitizedTitle}.${format}`;

      console.log('🔽 Starting direct URL download:', {
        downloadUrl,
        filename,
      });

      // Create fake/temporary anchor element for direct download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.style.display = 'none';

      // Add to DOM and trigger click
      document.body.appendChild(link);
      link.click();

      // Clean up by removing the temporary element
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
      }, 1000);

      console.log('✅ Direct URL download initiated');

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success('Download started! Check your downloads folder.');
    } catch (error) {
      console.error('Download error:', error);

      // Provide more specific error messages based on error type
      if (error.name === 'SecurityError') {
        toast.error(
          'Download blocked by browser security. Please allow downloads for this site.'
        );
      } else if (error.name === 'NetworkError') {
        toast.error(
          'Network error occurred. Please check your connection and try again.'
        );
      } else {
        toast.error(
          'Failed to start download. Please try again or contact support.'
        );
      }
    } finally {
      // Always reset downloading state
      setIsDownloading(false);
    }
  }, [downloadUrl, selectedOption, videoInfo, isDownloading]);

  // Computed states
  const isLoading = status === EXTRACTION_STATUS.SUBMITTING;
  const isPollingExtraction = status === EXTRACTION_STATUS.POLLING_EXTRACTION;
  const isShowingOptions = status === EXTRACTION_STATUS.SHOWING_OPTIONS;
  const isTriggeringDownload = status === EXTRACTION_STATUS.TRIGGERING_DOWNLOAD;
  const isPollingDownload = status === EXTRACTION_STATUS.POLLING_DOWNLOAD;
  const isDownloadReady = status === EXTRACTION_STATUS.DOWNLOAD_READY;
  const hasError = status === EXTRACTION_STATUS.ERROR;
  const isCancelled = status === EXTRACTION_STATUS.CANCELLED;
  const isIdle = status === EXTRACTION_STATUS.IDLE;
  const canDownload = isDownloadReady && selectedOption?.id;

  return {
    // State
    status,
    extractionData,
    downloadOptions,
    selectedOption,
    downloadData,
    downloadUrl,
    videoInfo,
    error,
    progress,

    // Computed states
    isLoading,
    isPollingExtraction,
    isShowingOptions,
    isTriggeringDownload,
    isPollingDownload,
    isDownloadReady,
    isDownloading,
    hasError,
    isCancelled,
    isIdle,
    canDownload,

    // Actions
    extractVideo,
    selectDownloadOption,
    cancelExtraction,
    reset,
    downloadVideo,

    // Utilities
    formatFileSize: videoExtractionService.formatFileSize,
    formatDuration: videoExtractionService.formatDuration,
    getTimeUntilExpiration: videoExtractionService.getTimeUntilExpiration,
    isDownloadExpired: videoExtractionService.isDownloadExpired,
  };
};

export default useVideoExtraction;
