import http from '../utils/http';
import { handleApiError } from '../utils/errorHandler';
import useMembershipPlansStore from '../stores/membershipPlansStore';

// Membership Plans service functions
export const membershipPlansService = {
  /**
   * Fetch membership plans from API
   * @returns {Promise<{plans: Array, message: string}>}
   */
  async fetchPlans() {
    try {
      const response = await http.get('/membership-plans');

      // Handle both success/error response formats
      const responseData = response.data;
      if (responseData.error === false || responseData.success === true) {
        const plansData = responseData.data;

        // Update plans data in Zustand store
        useMembershipPlansStore.getState().setPlans(plansData);

        return { plans: plansData, message: responseData.message };
      } else {
        throw new Error(
          responseData.message || 'Failed to fetch membership plans'
        );
      }
    } catch (error) {
      // Set error in store
      const errorMessage = error.message || 'Failed to fetch membership plans';
      useMembershipPlansStore.getState().setError(errorMessage);
      throw error;
    }
  },

  /**
   * Get plans from store or fetch if not available/stale
   * @param {boolean} forceRefresh - Force refresh from API
   * @returns {Promise<Array>}
   */
  async getPlans(forceRefresh = false) {
    const store = useMembershipPlansStore.getState();

    // Return cached plans if available and not stale, unless force refresh
    if (!forceRefresh && store.plans.length > 0 && !store.isStale()) {
      return store.plans;
    }

    // Fetch fresh plans
    store.setLoading(true);
    try {
      const { plans } = await this.fetchPlans();
      return plans;
    } finally {
      store.setLoading(false);
    }
  },

  /**
   * Get active plans sorted by sort_order
   * @param {boolean} forceRefresh - Force refresh from API
   * @returns {Promise<Array>}
   */
  async getActivePlans(forceRefresh = false) {
    await this.getPlans(forceRefresh);
    return useMembershipPlansStore.getState().getActivePlans();
  },

  /**
   * Get featured plans
   * @param {boolean} forceRefresh - Force refresh from API
   * @returns {Promise<Array>}
   */
  async getFeaturedPlans(forceRefresh = false) {
    await this.getPlans(forceRefresh);
    return useMembershipPlansStore.getState().getFeaturedPlans();
  },

  /**
   * Get plan by ID
   * @param {number} id - The plan ID
   * @param {boolean} forceRefresh - Force refresh from API
   * @returns {Promise<Object|null>}
   */
  async getPlanById(id, forceRefresh = false) {
    await this.getPlans(forceRefresh);
    return useMembershipPlansStore.getState().getPlanById(id);
  },

  /**
   * Get plan by slug
   * @param {string} slug - The plan slug
   * @param {boolean} forceRefresh - Force refresh from API
   * @returns {Promise<Object|null>}
   */
  async getPlanBySlug(slug, forceRefresh = false) {
    await this.getPlans(forceRefresh);
    return useMembershipPlansStore.getState().getPlanBySlug(slug);
  },

  /**
   * Get current plans from store (synchronous)
   * @returns {Array}
   */
  getCurrentPlans() {
    return useMembershipPlansStore.getState().getPlans();
  },

  /**
   * Get current active plans from store (synchronous)
   * @returns {Array}
   */
  getCurrentActivePlans() {
    return useMembershipPlansStore.getState().getActivePlans();
  },

  /**
   * Get current featured plans from store (synchronous)
   * @returns {Array}
   */
  getCurrentFeaturedPlans() {
    return useMembershipPlansStore.getState().getFeaturedPlans();
  },

  /**
   * Check if plans are currently loading
   * @returns {boolean}
   */
  isLoading() {
    return useMembershipPlansStore.getState().getIsLoading();
  },

  /**
   * Get current error state
   * @returns {string|null}
   */
  getError() {
    return useMembershipPlansStore.getState().getError();
  },

  /**
   * Clear plans from store
   */
  clearPlans() {
    useMembershipPlansStore.getState().clearPlans();
  },
};
