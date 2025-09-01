import { create } from 'zustand';

/**
 * @typedef {Object} MembershipPlan
 * @property {number} id - Plan ID
 * @property {string} name - Plan name
 * @property {string} slug - Plan slug
 * @property {string} description - Plan description
 * @property {string} price - Plan price as string
 * @property {string} currency - Currency code (USD, EUR, VND, etc.)
 * @property {string} billing_cycle - Billing cycle (monthly, yearly, lifetime)
 * @property {string} billing_cycle_label - Human readable billing cycle
 * @property {string} formatted_price - Formatted price string
 * @property {number} daily_request_limit - Daily request limit (0 = unlimited)
 * @property {number} total_request_download - Total request limit (0 = unlimited)
 * @property {string[]} allowed_platforms - Array of allowed platforms
 * @property {string[]} allowed_qualities - Array of allowed video qualities
 * @property {string[]} allowed_formats - Array of allowed file formats
 * @property {boolean} priority_processing - Whether plan has priority processing
 * @property {number} max_file_size_mb - Maximum file size in MB
 * @property {boolean} is_active - Whether plan is active
 * @property {boolean} is_featured - Whether plan is featured
 * @property {number} sort_order - Sort order for display
 * @property {boolean} has_unlimited_daily_requests - Whether daily requests are unlimited
 * @property {boolean} has_unlimited_total_requests - Whether total requests are unlimited
 */

// Membership Plans store for managing membership plan data
const useMembershipPlansStore = create((set, get) => ({
  // State
  /** @type {MembershipPlan[]} */
  plans: [],
  isLoading: false,
  error: null,
  lastFetched: null,

  // Actions
  /**
   * Set membership plans data
   * @param {MembershipPlan[]} plansData - The plans data to store
   */
  setPlans: plansData => {
    set({
      plans: plansData,
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
   * Set error state
   * @param {string|null} error - Error message
   */
  setError: error => {
    set({ error, isLoading: false });
  },

  /**
   * Clear plans data
   */
  clearPlans: () => {
    set({
      plans: [],
      error: null,
      lastFetched: null,
    });
  },

  // Getters
  /**
   * Get all plans
   * @returns {MembershipPlan[]}
   */
  getPlans: () => get().plans,

  /**
   * Get plan by ID
   * @param {number} id - The plan ID
   * @returns {MembershipPlan|null}
   */
  getPlanById: id => {
    const plans = get().plans;
    return plans.find(plan => plan.id === id) || null;
  },

  /**
   * Get plan by slug
   * @param {string} slug - The plan slug
   * @returns {MembershipPlan|null}
   */
  getPlanBySlug: slug => {
    const plans = get().plans;
    return plans.find(plan => plan.slug === slug) || null;
  },

  /**
   * Get featured plans
   * @returns {MembershipPlan[]}
   */
  getFeaturedPlans: () => {
    const plans = get().plans;
    return plans.filter(plan => plan.is_featured && plan.is_active);
  },

  /**
   * Get active plans sorted by sort_order
   * @returns {MembershipPlan[]}
   */
  getActivePlans: () => {
    const plans = get().plans;
    return plans
      .filter(plan => plan.is_active)
      .sort((a, b) => a.sort_order - b.sort_order);
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
   * Check if plans are stale (older than 10 minutes)
   * @returns {boolean}
   */
  isStale: () => {
    const lastFetched = get().lastFetched;
    if (!lastFetched) return true;

    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    return new Date(lastFetched) < tenMinutesAgo;
  },
}));

export default useMembershipPlansStore;
