import { create } from 'zustand';

/**
 * @typedef {Object} SettingsData
 * @property {string} site_name - The name of the site
 * @property {string} site_description - Description of the site
 * @property {string} site_url - The site URL
 * @property {string} admin_email - Admin email address
 * @property {string} support_email - Support email address
 * @property {string} default_timezone - Default timezone
 * @property {boolean} maintenance_mode - Whether maintenance mode is enabled
 * @property {string} maintenance_message - Maintenance mode message
 * @property {string|null} terms_of_service_url - Terms of service URL
 * @property {string|null} privacy_policy_url - Privacy policy URL
 * @property {string} meta_title - Meta title for SEO
 * @property {string} meta_description - Meta description for SEO
 * @property {string} meta_keywords - Meta keywords for SEO
 * @property {string} copyright_text - Copyright text
 * @property {string} copyright_year - Copyright year
 * @property {string} logo_path - Logo image path
 * @property {string} favicon_path - Favicon image path
 */

// Settings store for managing application settings
const useSettingsStore = create((set, get) => ({
  // State
  /** @type {SettingsData|null} */
  settings: null,
  isLoading: false,
  error: null,
  lastFetched: null,
  fetchPromise: null, // Track ongoing fetch to prevent multiple simultaneous requests

  // Actions
  /**
   * Set settings data
   * @param {SettingsData} settingsData - The settings data to store
   */
  setSettings: settingsData => {
    set({
      settings: settingsData,
      error: null,
      lastFetched: new Date().toISOString(),
    });
  },

  /**
   * Set loading state
   * @param {boolean} loading - Loading state
   */
  setLoading: loading => {
    set({ isLoading: loading });
  },

  /**
   * Set fetch promise to track ongoing requests
   * @param {Promise|null} promise - The fetch promise
   */
  setFetchPromise: promise => {
    set({ fetchPromise: promise });
  },

  /**
   * Set error state
   * @param {string|null} error - Error message
   */
  setError: error => {
    set({ error, isLoading: false });
  },

  /**
   * Clear settings data
   */
  clearSettings: () => {
    set({
      settings: null,
      error: null,
      lastFetched: null,
      fetchPromise: null,
    });
  },

  // Getters
  /**
   * Get all settings
   * @returns {SettingsData|null}
   */
  getSettings: () => get().settings,

  /**
   * Get setting by key
   * @param {string} key - The setting key to retrieve
   * @returns {any} The setting value or null if not found
   */
  getSettingByKey: key => {
    const settings = get().settings;
    return settings ? settings[key] : null;
  },

  /**
   * Get loading state
   * @returns {boolean}
   */
  getIsLoading: () => get().isLoading,

  /**
   * Get error state
   * @returns {string|null}
   */
  getError: () => get().error,

  /**
   * Check if settings are stale (older than 5 minutes)
   * @returns {boolean}
   */
  isStale: () => {
    const lastFetched = get().lastFetched;
    if (!lastFetched) return true;

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return new Date(lastFetched) < fiveMinutesAgo;
  },
}));

export default useSettingsStore;
