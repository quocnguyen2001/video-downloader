import toast from 'react-hot-toast';

/**
 * Handles API errors and displays appropriate toast notifications
 * @param {Object} error - The error object from the API
 * @param {string} defaultMessage - Default message to show if no specific error message is available
 * @returns {string} - The error message that was displayed
 */
export const handleApiError = (
  error,
  defaultMessage = 'An unexpected error occurred'
) => {
  let errorMessage = defaultMessage;

  if (error) {
    // Check for different error message formats
    if (error.message) {
      errorMessage = error.message;
    } else if (error.data?.message) {
      errorMessage = error.data.message;
    } else if (error.data?.error) {
      errorMessage = error.data.error;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    }

    // Handle validation errors (422 status)
    if (error.status === 422 && error.data?.errors) {
      const validationErrors = error.data.errors;
      const firstError = Object.values(validationErrors)[0];
      if (Array.isArray(firstError) && firstError.length > 0) {
        errorMessage = firstError[0];
      }
    }

    // Handle specific HTTP status codes
    // eslint-disable-next-line default-case
    switch (error.status) {
      case 401:
        errorMessage =
          'Invalid credentials. Please check your email and password.';
        break;
      case 403:
        errorMessage =
          'Access denied. You do not have permission to perform this action.';
        break;
      case 404:
        errorMessage = 'The requested resource was not found.';
        break;
      case 429:
        errorMessage = 'Too many requests. Please try again later.';
        break;
      case 500:
        errorMessage = 'Server error. Please try again later.';
        break;
      case 503:
        errorMessage =
          'Service temporarily unavailable. Please try again later.';
        break;
    }
  }

  // Display the error toast
  toast.error(errorMessage);

  return errorMessage;
};

/**
 * Handles API success responses and displays appropriate toast notifications
 * @param {string} message - Success message to display
 * @param {Object} options - Toast options
 */
export const handleApiSuccess = (message, options = {}) => {
  toast.success(message, options);
};

/**
 * Handles form validation errors
 * @param {Object} errors - Validation errors object
 * @returns {string} - First error message found
 */
export const handleValidationErrors = errors => {
  if (!errors || typeof errors !== 'object') {
    return null;
  }

  // Get the first error message
  const firstErrorKey = Object.keys(errors)[0];
  if (firstErrorKey && errors[firstErrorKey]) {
    const errorMessage = Array.isArray(errors[firstErrorKey])
      ? errors[firstErrorKey][0]
      : errors[firstErrorKey];

    toast.error(errorMessage);
    return errorMessage;
  }

  return null;
};

/**
 * Shows a loading toast that can be updated
 * @param {string} message - Loading message
 * @returns {string} - Toast ID for updating
 */
export const showLoadingToast = (message = 'Loading...') => {
  return toast.loading(message);
};

/**
 * Updates a loading toast with success message
 * @param {string} toastId - Toast ID from showLoadingToast
 * @param {string} message - Success message
 */
export const updateToastSuccess = (toastId, message) => {
  toast.success(message, { id: toastId });
};

/**
 * Updates a loading toast with error message
 * @param {string} toastId - Toast ID from showLoadingToast
 * @param {string} message - Error message
 */
export const updateToastError = (toastId, message) => {
  toast.error(message, { id: toastId });
};
