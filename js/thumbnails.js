/**
 * Thumbnail Manager
 * Handles the generation and caching of website thumbnails
 */
class ThumbnailManager {
    constructor() {
        this.faviconApiBaseUrl = 'https://www.google.com/s2/favicons?domain=';
        this.colorCache = {};
    }

    /**
     * Get a favicon URL for a website
     * @param {String} url Website URL
     * @returns {String} Favicon URL
     */
    getFaviconUrl(url) {
        try {
            const domain = new URL(url).hostname;
            return `${this.faviconApiBaseUrl}${domain}&sz=64`;
        } catch (error) {
            console.error('Error generating favicon URL:', error);
            return null;
        }
    }

    /**
     * Generate a dominant color for a website (using its domain as a seed)
     * @param {String} url Website URL
     * @returns {String} Hex color code
     */
    getDominantColor(url) {
        try {
            const domain = new URL(url).hostname;
            
            // Check if color is already cached
            if (this.colorCache[domain]) {
                return this.colorCache[domain];
            }
            
            // Generate a pseudo-random color based on domain string
            let hash = 0;
            for (let i = 0; i < domain.length; i++) {
                hash = domain.charCodeAt(i) + ((hash << 5) - hash);
            }
            
            // Convert to hex color
            let color = '#';
            for (let i = 0; i < 3; i++) {
                const value = (hash >> (i * 8)) & 0xFF;
                color += ('00' + value.toString(16)).substr(-2);
            }
            
            // Ensure color is not too light or dark for dark mode
            const r = parseInt(color.substr(1, 2), 16);
            const g = parseInt(color.substr(3, 2), 16);
            const b = parseInt(color.substr(5, 2), 16);
            
            // If too dark, lighten
            if (r + g + b < 300) {
                color = this.lightenColor(color, 40);
            }
            
            // If too light, darken
            if (r + g + b > 600) {
                color = this.darkenColor(color, 40);
            }
            
            // Cache and return
            this.colorCache[domain] = color;
            return color;
        } catch (error) {
            console.error('Error generating dominant color:', error);
            return '#7C3AED'; // Default to primary color
        }
    }

    /**
     * Lighten a hex color
     * @param {String} color Hex color code
     * @param {Number} percent Percentage to lighten (0-100)
     * @returns {String} Lightened hex color
     */
    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        
        return '#' + (
            0x1000000 + 
            (R < 255 ? R : 255) * 0x10000 + 
            (G < 255 ? G : 255) * 0x100 + 
            (B < 255 ? B : 255)
        ).toString(16).slice(1);
    }

    /**
     * Darken a hex color
     * @param {String} color Hex color code
     * @param {Number} percent Percentage to darken (0-100)
     * @returns {String} Darkened hex color
     */
    darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        
        return '#' + (
            0x1000000 + 
            (R > 0 ? R : 0) * 0x10000 + 
            (G > 0 ? G : 0) * 0x100 + 
            (B > 0 ? B : 0)
        ).toString(16).slice(1);
    }

    /**
     * Get the first letter of a website name for placeholder generation
     * @param {String} name Website name
     * @returns {String} First letter
     */
    getInitialLetter(name) {
        return name && name.length > 0 ? name.charAt(0).toUpperCase() : '?';
    }

    /**
     * Create a placeholder thumbnail element with website initial
     * @param {String} name Website name
     * @param {String} url Website URL
     * @returns {HTMLElement} Generated placeholder element
     */
    createPlaceholderThumbnail(name, url) {
        const placeholderDiv = document.createElement('div');
        placeholderDiv.className = 'placeholder';
        placeholderDiv.style.backgroundColor = this.getDominantColor(url);
        
        const initial = this.getInitialLetter(name);
        placeholderDiv.textContent = initial;
        
        return placeholderDiv;
    }

    /**
     * Generate a thumbnail element for a website
     * @param {Object} website Website object
     * @returns {HTMLElement} Generated thumbnail element
     */
    createThumbnail(website) {
        const thumbnailContainer = document.createElement('div');
        thumbnailContainer.className = 'website-thumbnail';
        
        // Always use custom thumbnail URL if available
        if (website.thumbnailUrl) {
            // Create a styled thumbnail with custom image
            const customThumbnail = document.createElement('div');
            customThumbnail.className = 'custom-thumbnail';
            customThumbnail.style.backgroundImage = `url(${website.thumbnailUrl})`;
            customThumbnail.style.backgroundSize = 'cover';
            customThumbnail.style.backgroundPosition = 'center';
            
            // Add a gradient overlay for better visibility of text
            const overlay = document.createElement('div');
            overlay.className = 'thumbnail-overlay';
            
            customThumbnail.appendChild(overlay);
            thumbnailContainer.appendChild(customThumbnail);
            return thumbnailContainer;
        } 
        
        // Fallback to letter placeholder if no thumbnail URL
        thumbnailContainer.appendChild(this.createPlaceholderThumbnail(website.name, website.url));
        return thumbnailContainer;
    }
}

// Create and export a single instance of the ThumbnailManager
const thumbnailManager = new ThumbnailManager();
