/**
 * Generates an optimized Sanity CDN image URL with custom dimensions, quality, and automatic WebP formatting.
 * 
 * @param {string} url The raw image URL from Sanity
 * @param {number} width The desired width of the image
 * @param {number} quality The desired image quality (1-100)
 * @returns {string} The optimized image URL
 */
export function getOptimizedImageUrl(url, width = 600, quality = 75) {
  if (!url) return '';
  
  if (url.includes('cdn.sanity.io')) {
    // If the URL already contains query parameters, append with &, otherwise with ?
    const separator = url.includes('?') ? '&' : '?';
    // auto=format tells Sanity to serve modern formats (like WebP or AVIF) if the browser supports them.
    return `${url}${separator}w=${width}&q=${quality}&auto=format`;
  }
  
  return url;
}
