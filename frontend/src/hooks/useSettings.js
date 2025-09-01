import { useState, useEffect } from 'react';
import { settingsService } from '../services/settings';
import useSettingsStore from '../stores/settingsStore';
import { handleApiError } from '../utils/errorHandler';

/**
 * Custom hook for managing settings with optimized Zustand integration
 * @param {boolean} autoFetch - Whether to automatically fetch settings on mount
 * @returns {Object} Settings hook object
 */
export const useSettings = (autoFetch = true) => {
  const { settings, isLoading, error, lastFetched, fetchPromise } =
    useSettingsStore();
  const [initLoading, setInitLoading] = useState(false);

  // Fetch settings on mount if autoFetch is true and not already cached or being fetched
  useEffect(() => {
    if (autoFetch && !settings && !isLoading && !lastFetched && !fetchPromise) {
      const fetchInitialSettings = async () => {
        try {
          setInitLoading(true);
          await settingsService.getSettings();
        } catch (error) {
          console.error('Failed to fetch initial settings:', error);
          handleApiError(error, 'Failed to load settings');
        } finally {
          setInitLoading(false);
        }
      };

      fetchInitialSettings();
    }
  }, [autoFetch, settings, isLoading, lastFetched, fetchPromise]);

  /**
   * Refresh settings from API
   * @returns {Promise<Object|null>}
   */
  const refreshSettings = async () => {
    try {
      return await settingsService.getSettings(true);
    } catch (error) {
      handleApiError(error, 'Failed to refresh settings');
      return null;
    }
  };

  /**
   * Get setting by key (synchronous)
   * @param {string} key - The setting key
   * @returns {any}
   */
  const getSettingByKey = key => {
    return settingsService.getCurrentSettingByKey(key);
  };

  return {
    settings,
    isLoading: isLoading || initLoading,
    error,
    refreshSettings,
    getSettingByKey,
  };
};

/**
 * Custom hook for getting a specific setting by key with optimized caching
 * @param {string} key - The setting key to retrieve
 * @param {boolean} autoFetch - Whether to automatically fetch settings if not available
 * @returns {Object} Setting hook object
 */
export const useSettingByKey = (key, autoFetch = true) => {
  const { settings, isLoading, error, lastFetched, fetchPromise } =
    useSettingsStore();
  const [initLoading, setInitLoading] = useState(false);
  const [value, setValue] = useState(null);

  // Update value when settings change
  useEffect(() => {
    if (settings) {
      setValue(settings[key] || null);
    }
  }, [settings, key]);

  // Fetch settings on mount if autoFetch is true and settings not available and not being fetched
  useEffect(() => {
    if (autoFetch && !settings && !isLoading && !lastFetched && !fetchPromise) {
      const fetchInitialSettings = async () => {
        try {
          setInitLoading(true);
          await settingsService.getSettings();
        } catch (error) {
          console.error(`Failed to fetch settings for key "${key}":`, error);
          handleApiError(error, 'Failed to load settings');
        } finally {
          setInitLoading(false);
        }
      };

      fetchInitialSettings();
    }
  }, [autoFetch, settings, isLoading, lastFetched, fetchPromise, key]);

  /**
   * Refresh the specific setting from API
   * @returns {Promise<any>}
   */
  const refreshSetting = async () => {
    try {
      return await settingsService.getSettingByKey(key, true);
    } catch (error) {
      handleApiError(error, `Failed to refresh setting "${key}"`);
      return null;
    }
  };

  return {
    value,
    isLoading: isLoading || initLoading,
    error,
    refreshSetting,
  };
};

export default useSettings;
