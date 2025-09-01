import http from '../utils/http';
import useSettingsStore from '../stores/settingsStore';

// Settings service functions
export const settingsService = {
  /**
   * Fetch settings from API
   * @returns {Promise<{settings: Object, message: string}>}
   */
  async fetchSettings() {
    try {
      console.log('🔄 Fetching settings from API...');
      const response = await http.get('/settings');

      // Handle both success/error response formats
      const responseData = response.data;
      if (responseData.error === false || responseData.success === true) {
        const settingsData = responseData.data;

        // Update settings data in Zustand store
        useSettingsStore.getState().setSettings(settingsData);
        console.log('✅ Settings fetched and cached successfully');

        return { settings: settingsData, message: responseData.message };
      } else {
        throw new Error(responseData.message || 'Failed to fetch settings');
      }
    } catch (error) {
      // Set error in store
      const errorMessage = error.message || 'Failed to fetch settings';
      useSettingsStore.getState().setError(errorMessage);
      throw error;
    }
  },

  /**
   * Get settings from store or fetch if not available/stale
   * @param {boolean} forceRefresh - Force refresh from API
   * @returns {Promise<Object>}
   */
  async getSettings(forceRefresh = false) {
    const store = useSettingsStore.getState();

    // Return cached settings if available and not stale, unless force refresh
    if (!forceRefresh && store.settings && !store.isStale()) {
      console.log('📋 Using cached settings');
      return store.settings;
    }

    // If there's already a fetch in progress, wait for it
    if (store.fetchPromise) {
      console.log('⏳ Waiting for ongoing settings fetch...');
      try {
        await store.fetchPromise;
        console.log('✅ Using settings from ongoing fetch');
        return store.settings;
      } catch (error) {
        // If the ongoing fetch failed, we'll try again below
        console.warn('❌ Ongoing fetch failed, retrying:', error);
      }
    }

    // Start new fetch
    store.setLoading(true);
    const fetchPromise = this.fetchSettings()
      .then(({ settings }) => {
        store.setFetchPromise(null);
        return settings;
      })
      .catch(error => {
        store.setFetchPromise(null);
        throw error;
      });

    // Store the promise to prevent duplicate requests
    store.setFetchPromise(fetchPromise);

    try {
      const settings = await fetchPromise;
      return settings;
    } finally {
      store.setLoading(false);
    }
  },

  /**
   * Get specific setting by key
   * @param {string} key - The setting key to retrieve
   * @param {boolean} forceRefresh - Force refresh from API
   * @returns {Promise<any>}
   */
  async getSettingByKey(key, forceRefresh = false) {
    const settings = await this.getSettings(forceRefresh);
    return settings ? settings[key] : null;
  },

  /**
   * Get current settings from store (synchronous)
   * @returns {Object|null}
   */
  getCurrentSettings() {
    return useSettingsStore.getState().getSettings();
  },

  /**
   * Get current setting by key from store (synchronous)
   * @param {string} key - The setting key to retrieve
   * @returns {any}
   */
  getCurrentSettingByKey(key) {
    return useSettingsStore.getState().getSettingByKey(key);
  },

  /**
   * Check if settings are currently loading
   * @returns {boolean}
   */
  isLoading() {
    return useSettingsStore.getState().getIsLoading();
  },

  /**
   * Get current error state
   * @returns {string|null}
   */
  getError() {
    return useSettingsStore.getState().getError();
  },

  /**
   * Clear settings from store
   */
  clearSettings() {
    useSettingsStore.getState().clearSettings();
  },
};
