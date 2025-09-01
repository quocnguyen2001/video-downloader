import { useEffect } from 'react';
import { useSettings } from './useSettings';

/**
 * Custom hook for managing document meta tags using settings
 * @param {Object} pageMetaOverrides - Override meta tags for specific pages
 * @param {string} pageMetaOverrides.title - Page specific title
 * @param {string} pageMetaOverrides.description - Page specific description
 * @param {string} pageMetaOverrides.keywords - Page specific keywords
 */
export const useMetaTags = (pageMetaOverrides = {}) => {
  const { settings } = useSettings();

  useEffect(() => {
    if (!settings) return;

    // Update document title
    const title =
      pageMetaOverrides.title ||
      settings.meta_title ||
      settings.site_name ||
      'Social Downloader';
    document.title = title;

    // Update meta description
    const description =
      pageMetaOverrides.description ||
      settings.meta_description ||
      settings.site_description ||
      'Download videos from social media platforms';
    updateMetaTag('description', description);

    // Update meta keywords
    const keywords =
      pageMetaOverrides.keywords ||
      settings.meta_keywords ||
      'video downloader, social media downloader';
    updateMetaTag('keywords', keywords);

    // Update Open Graph tags
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag(
      'og:site_name',
      settings.site_name || 'Social Downloader',
      'property'
    );
    updateMetaTag('og:type', 'website', 'property');

    if (settings.site_url) {
      updateMetaTag('og:url', settings.site_url, 'property');
    }

    // Update Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image', 'name');
    updateMetaTag('twitter:title', title, 'name');
    updateMetaTag('twitter:description', description, 'name');

    // Update favicon if available
    if (settings.favicon_path) {
      updateFavicon(settings.favicon_path);
    }
  }, [settings, pageMetaOverrides]);

  /**
   * Update or create a meta tag
   * @param {string} name - Meta tag name or property
   * @param {string} content - Meta tag content
   * @param {string} attribute - Attribute type ('name' or 'property')
   */
  const updateMetaTag = (name, content, attribute = 'name') => {
    if (!content) return;

    let metaTag = document.querySelector(`meta[${attribute}="${name}"]`);

    if (metaTag) {
      metaTag.setAttribute('content', content);
    } else {
      metaTag = document.createElement('meta');
      metaTag.setAttribute(attribute, name);
      metaTag.setAttribute('content', content);
      document.head.appendChild(metaTag);
    }
  };

  /**
   * Update favicon
   * @param {string} faviconUrl - Favicon URL
   */
  const updateFavicon = faviconUrl => {
    // Remove existing favicon links
    const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
    existingFavicons.forEach(favicon => favicon.remove());

    // Add new favicon
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/x-icon';
    favicon.href = faviconUrl;
    document.head.appendChild(favicon);

    // Add apple touch icon
    const appleTouchIcon = document.createElement('link');
    appleTouchIcon.rel = 'apple-touch-icon';
    appleTouchIcon.href = faviconUrl;
    document.head.appendChild(appleTouchIcon);
  };

  return {
    updateMetaTag,
    updateFavicon,
  };
};

/**
 * Hook for setting page-specific meta tags
 * @param {string} title - Page title
 * @param {string} description - Page description
 * @param {string} keywords - Page keywords
 */
export const usePageMeta = (title, description, keywords) => {
  useMetaTags({
    title,
    description,
    keywords,
  });
};

export default useMetaTags;
