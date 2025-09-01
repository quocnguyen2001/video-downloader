import { useState, useEffect } from 'react';
import { membershipPlansService } from '../services/membershipPlans';
import useMembershipPlansStore from '../stores/membershipPlansStore';
import { handleApiError } from '../utils/errorHandler';

/**
 * Custom hook for managing membership plans
 * @param {boolean} autoFetch - Whether to automatically fetch plans on mount
 * @returns {Object} Membership plans hook object
 */
export const useMembershipPlans = (autoFetch = true) => {
  const { plans, isLoading, error } = useMembershipPlansStore();
  const [initLoading, setInitLoading] = useState(false);

  // Fetch plans on mount if autoFetch is true
  useEffect(() => {
    if (autoFetch && plans.length === 0 && !isLoading) {
      const fetchInitialPlans = async () => {
        try {
          setInitLoading(true);
          await membershipPlansService.getPlans();
        } catch (error) {
          console.error('Failed to fetch initial membership plans:', error);
          handleApiError(error, 'Failed to load membership plans');
        } finally {
          setInitLoading(false);
        }
      };

      fetchInitialPlans();
    }
  }, [autoFetch, plans.length]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Refresh plans from API
   * @returns {Promise<Array|null>}
   */
  const refreshPlans = async () => {
    try {
      return await membershipPlansService.getPlans(true);
    } catch (error) {
      handleApiError(error, 'Failed to refresh membership plans');
      return null;
    }
  };

  /**
   * Get active plans (synchronous)
   * @returns {Array}
   */
  const getActivePlans = () => {
    return membershipPlansService.getCurrentActivePlans();
  };

  /**
   * Get featured plans (synchronous)
   * @returns {Array}
   */
  const getFeaturedPlans = () => {
    return membershipPlansService.getCurrentFeaturedPlans();
  };

  return {
    plans,
    isLoading: isLoading || initLoading,
    error,
    refreshPlans,
    getActivePlans,
    getFeaturedPlans,
  };
};

/**
 * Custom hook for getting active membership plans
 * @param {boolean} autoFetch - Whether to automatically fetch plans if not available
 * @returns {Object} Active plans hook object
 */
export const useActiveMembershipPlans = (autoFetch = true) => {
  const { plans, isLoading, error } = useMembershipPlansStore();
  const [initLoading, setInitLoading] = useState(false);
  const [activePlans, setActivePlans] = useState([]);

  // Update active plans when plans change
  useEffect(() => {
    if (plans.length > 0) {
      setActivePlans(membershipPlansService.getCurrentActivePlans());
    }
  }, [plans]);

  // Fetch plans on mount if autoFetch is true and plans not available
  useEffect(() => {
    if (autoFetch && plans.length === 0 && !isLoading) {
      const fetchInitialPlans = async () => {
        try {
          setInitLoading(true);
          await membershipPlansService.getActivePlans();
        } catch (error) {
          console.error('Failed to fetch active membership plans:', error);
          handleApiError(error, 'Failed to load membership plans');
        } finally {
          setInitLoading(false);
        }
      };

      fetchInitialPlans();
    }
  }, [autoFetch, plans.length]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Refresh active plans from API
   * @returns {Promise<Array|null>}
   */
  const refreshActivePlans = async () => {
    try {
      return await membershipPlansService.getActivePlans(true);
    } catch (error) {
      handleApiError(error, 'Failed to refresh active membership plans');
      return null;
    }
  };

  return {
    activePlans,
    isLoading: isLoading || initLoading,
    error,
    refreshActivePlans,
  };
};

/**
 * Custom hook for getting featured membership plans
 * @param {boolean} autoFetch - Whether to automatically fetch plans if not available
 * @returns {Object} Featured plans hook object
 */
export const useFeaturedMembershipPlans = (autoFetch = true) => {
  const { plans, isLoading, error } = useMembershipPlansStore();
  const [initLoading, setInitLoading] = useState(false);
  const [featuredPlans, setFeaturedPlans] = useState([]);

  // Update featured plans when plans change
  useEffect(() => {
    if (plans.length > 0) {
      setFeaturedPlans(membershipPlansService.getCurrentFeaturedPlans());
    }
  }, [plans]);

  // Fetch plans on mount if autoFetch is true and plans not available
  useEffect(() => {
    if (autoFetch && plans.length === 0 && !isLoading) {
      const fetchInitialPlans = async () => {
        try {
          setInitLoading(true);
          await membershipPlansService.getFeaturedPlans();
        } catch (error) {
          console.error('Failed to fetch featured membership plans:', error);
          handleApiError(error, 'Failed to load membership plans');
        } finally {
          setInitLoading(false);
        }
      };

      fetchInitialPlans();
    }
  }, [autoFetch, plans.length]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Refresh featured plans from API
   * @returns {Promise<Array|null>}
   */
  const refreshFeaturedPlans = async () => {
    try {
      return await membershipPlansService.getFeaturedPlans(true);
    } catch (error) {
      handleApiError(error, 'Failed to refresh featured membership plans');
      return null;
    }
  };

  return {
    featuredPlans,
    isLoading: isLoading || initLoading,
    error,
    refreshFeaturedPlans,
  };
};

export default useMembershipPlans;
