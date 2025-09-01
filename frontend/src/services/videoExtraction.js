import http from '../utils/http';
import useUserStore from '../stores/userStore';

// Video extraction service functions
export const videoExtractionService = {
  /**
   * Extract video from URL (new API flow)
   * @param {string} url - Video URL
   * @param {boolean} isAuthenticated - Whether user is authenticated
   * @returns {Promise} - Extraction response with session_id
   */
  async extractVideo(url, isAuthenticated = false) {
    try {
      const endpoint = isAuthenticated
        ? '/auth/extract-video'
        : '/guest/extract-video';

      // Prepare query parameters - only URL needed for new flow
      const params = new URLSearchParams({
        url: url.trim(),
      });

      const response = await http.post(`${endpoint}?${params.toString()}`);

      // Handle response format
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      } else {
        throw new Error(response.data.message || 'Extraction request failed');
      }
    } catch (error) {
      // Handle specific error cases
      if (error.status === 429) {
        throw {
          ...error,
          message: 'Rate limit exceeded. Please try again later.',
          isRateLimit: true,
        };
      }

      throw error;
    }
  },

  /**
   * Poll extraction status
   * @param {string} sessionId - Session ID from extraction request
   * @returns {Promise} - Status response
   */
  async pollStatus(sessionId) {
    try {
      const response = await http.get(`/extract/status/${sessionId}`);

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
        };
      } else {
        throw new Error(
          response.data.message || 'Failed to get extraction status'
        );
      }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Trigger download for selected option
   * @param {string} downloadOptionId - Download option ID
   * @returns {Promise} - Trigger response
   */
  async triggerDownload(downloadOptionId) {
    try {
      const response = await http.post('/download/trigger', {
        download_option_id: downloadOptionId,
      });

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      } else {
        throw new Error(response.data.message || 'Failed to trigger download');
      }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Poll download status
   * @param {string} downloadOptionId - Download option ID
   * @returns {Promise} - Download status response
   */
  async pollDownloadStatus(downloadOptionId) {
    try {
      const response = await http.get(
        `/download/status?download_option_id=${downloadOptionId}`
      );

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
        };
      } else {
        throw new Error(
          response.data.message || 'Failed to get download status'
        );
      }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Download video file directly via new API endpoint
   * @param {string} downloadOptionId - Download option ID
   * @param {string} filename - Suggested filename
   * @returns {Promise} - Binary file response
   */
  async downloadVideoByOptionId(downloadOptionId, filename = 'video') {
    const sanitizedFilename = filename.replace(/[<>:"/\\|?*]/g, '_');

    console.log('🔽 Starting direct API download:', {
      downloadOptionId,
      filename: sanitizedFilename,
    });

    try {
      // Make API request to new endpoint
      const response = await http.get(`download-media/${downloadOptionId}`, {
        responseType: 'blob', // Important for binary file data
        timeout: 60000, // 60 second timeout for large files
      });

      // Extract filename from Content-Disposition header if available
      let finalFilename = sanitizedFilename;
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        if (filenameMatch && filenameMatch[1]) {
          finalFilename = filenameMatch[1].replace(/['"]/g, '');
        }
      }

      // Create blob URL from response data
      const blob = new Blob([response.data]);
      const blobUrl = window.URL.createObjectURL(blob);

      // Create anchor element and trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = finalFilename;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.style.display = 'none';

      // Add to DOM and trigger click
      document.body.appendChild(link);
      link.click();

      // Clean up
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        // Clean up blob URL to prevent memory leaks
        window.URL.revokeObjectURL(blobUrl);
      }, 1000);

      console.log('✅ Direct API download completed');
      return true;
    } catch (error) {
      console.error('❌ Direct API download failed:', error);
      throw error;
    }
  },

  /**
   * Download video file via API (legacy method)
   * @param {string} downloadUrl - Download URL from extraction result
   * @param {string} filename - Suggested filename
   */
  async downloadVideo(downloadUrl, filename = 'video') {
    const sanitizedFilename = filename.replace(/[<>:"/\\|?*]/g, '_');

    console.log('🔽 Starting API-based download:', {
      downloadUrl,
      filename: sanitizedFilename,
    });

    try {
      // Check authentication status
      const isAuthenticated = useUserStore.getState().isAuthenticated;

      // Determine API endpoint based on authentication status
      const endpoint = isAuthenticated
        ? '/auth/download-video'
        : '/guest/download-video';

      console.log(
        `📡 Using ${isAuthenticated ? 'authenticated' : 'guest'} download API`
      );

      // Make API request with download URL as query parameter
      const response = await http.get(endpoint, {
        params: { url: downloadUrl },
        responseType: 'blob', // Important for binary file data
        timeout: 60000, // 60 second timeout for large files
      });

      // Extract filename from Content-Disposition header if available
      let finalFilename = sanitizedFilename;
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        if (filenameMatch && filenameMatch[1]) {
          finalFilename = filenameMatch[1].replace(/['"]/g, '');
        }
      }

      // Create blob URL from response data
      const blob = new Blob([response.data]);
      const blobUrl = window.URL.createObjectURL(blob);

      // Create anchor element and trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = finalFilename;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.style.display = 'none';

      // Add to DOM and trigger click
      document.body.appendChild(link);
      link.click();

      // Clean up
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        // Clean up blob URL to prevent memory leaks
        window.URL.revokeObjectURL(blobUrl);
      }, 1000);

      console.log('✅ API-based download initiated successfully');
      return true;
    } catch (error) {
      console.error('❌ API-based download failed:', error);

      // Handle specific error cases
      if (error.status === 401) {
        throw new Error(
          'Authentication required for download. Please log in and try again.'
        );
      } else if (error.status === 404) {
        throw new Error(
          'Download URL not found or has expired. Please extract the video again.'
        );
      } else if (error.status === 429) {
        throw new Error(
          'Download rate limit exceeded. Please try again later.'
        );
      } else if (
        error.code === 'ECONNABORTED' ||
        error.message.includes('timeout')
      ) {
        throw new Error(
          'Download timeout. The file might be too large or connection is slow.'
        );
      } else {
        throw new Error(
          `Download failed: ${error.message || 'Unknown error occurred'}`
        );
      }
    }
  },

  /**
   * Alternative download method for CORS-restricted URLs
   * Uses the backend as a proxy to bypass CORS restrictions
   * @param {string} downloadUrl - Download URL
   * @param {string} filename - Filename
   */
  async downloadViaProxy(downloadUrl, filename) {
    console.log('🔄 Attempting proxy download...');

    try {
      // Use your backend API to proxy the download
      const proxyEndpoint = '/proxy-download';
      const response = await http.post(proxyEndpoint, {
        url: downloadUrl,
        filename: filename,
      });

      if (response.data.success) {
        // Backend should return a proxied URL or blob
        const proxiedUrl = response.data.download_url;

        // Download the proxied file
        const link = document.createElement('a');
        link.href = proxiedUrl;
        link.download = filename;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log('✅ Proxy download completed');
        return true;
      } else {
        throw new Error(response.data.message || 'Proxy download failed');
      }
    } catch (error) {
      console.error('❌ Proxy download failed:', error);
      throw error;
    }
  },

  /**
   * Test download functionality
   */
  async testDownload() {
    console.log('🧪 Testing download functionality...');

    // Create a test blob
    const testContent = `Test Download File
Generated at: ${new Date().toISOString()}
This file verifies that the download mechanism is working correctly.`;

    const blob = new Blob([testContent], { type: 'text/plain' });
    const blobUrl = window.URL.createObjectURL(blob);

    try {
      // Create download link
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'download-test.txt';
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 1000);

      console.log('✅ Test download completed');
      return true;
    } catch (error) {
      console.error('❌ Test download failed:', error);
      throw error;
    }
  },

  /**
   * Create a test blob for download testing
   * @returns {string} Blob URL
   */
  createTestBlob() {
    const content = `Test Download File
Generated at: ${new Date().toISOString()}
This is a test file to verify the download functionality is working correctly.
If you can see this file in your downloads folder, the download mechanism is working!`;

    const blob = new Blob([content], { type: 'text/plain' });
    return window.URL.createObjectURL(blob);
  },

  /**
   * Format file size for display
   * @param {number} bytes - File size in bytes
   * @returns {string} - Formatted file size
   */
  formatFileSize(bytes) {
    if (!bytes || bytes === 0) return 'Unknown size';

    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return `${Math.round((bytes / Math.pow(1024, i)) * 100) / 100} ${sizes[i]}`;
  },

  /**
   * Format duration for display
   * @param {number} seconds - Duration in seconds
   * @returns {string} - Formatted duration (MM:SS or HH:MM:SS)
   */
  formatDuration(seconds) {
    if (!seconds || seconds === 0) return 'Unknown duration';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  },

  /**
   * Check if download URL is expired
   * @param {string} expiresAt - Expiration timestamp
   * @returns {boolean} - Whether the URL is expired
   */
  isDownloadExpired(expiresAt) {
    if (!expiresAt) return false;

    const expirationTime = new Date(expiresAt);
    const currentTime = new Date();

    return currentTime >= expirationTime;
  },

  /**
   * Get time remaining until expiration
   * @param {string} expiresAt - Expiration timestamp
   * @returns {string} - Human readable time remaining
   */
  getTimeUntilExpiration(expiresAt) {
    if (!expiresAt) return 'Unknown';

    const expirationTime = new Date(expiresAt);
    const currentTime = new Date();
    const timeDiff = expirationTime - currentTime;

    if (timeDiff <= 0) return 'Expired';

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  },

  /**
   * Sort download options according to requirements
   * Order: Audio first, then 144p, 360p, 720p, 1080p and above
   * @param {Array} downloadOptions - Array of download options
   * @returns {Array} - Sorted download options
   */
  sortDownloadOptions(downloadOptions) {
    if (!Array.isArray(downloadOptions)) return [];

    const qualityOrder = {
      audio: 0,
      mp3: 0,
      '144p': 1,
      '360p': 2,
      '720p': 3,
      '1080p': 4,
      '1440p': 5,
      '2160p': 6,
      '4k': 6,
    };

    return downloadOptions.sort((a, b) => {
      const qualityA = a.quality?.toLowerCase() || '';
      const qualityB = b.quality?.toLowerCase() || '';

      // Check if it's audio format
      const isAudioA =
        qualityA.includes('audio') ||
        qualityA.includes('mp3') ||
        a.format === 'mp3';
      const isAudioB =
        qualityB.includes('audio') ||
        qualityB.includes('mp3') ||
        b.format === 'mp3';

      if (isAudioA && !isAudioB) return -1;
      if (!isAudioA && isAudioB) return 1;
      if (isAudioA && isAudioB) return 0;

      // For video qualities, use the order mapping
      const orderA = qualityOrder[qualityA] ?? 999;
      const orderB = qualityOrder[qualityB] ?? 999;

      return orderA - orderB;
    });
  },
};

export default videoExtractionService;
