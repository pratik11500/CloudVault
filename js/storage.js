/**
 * Storage Manager
 * Handles all operations related to storing and retrieving website data
 */
class StorageManager {
    constructor() {
        this.storageKey = 'linkVaultWebsites';
        this.websites = this.loadWebsites();
    }

    /**
     * Load websites from localStorage
     * @returns {Array} Array of website objects
     */
    loadWebsites() {
        try {
            const websites = JSON.parse(localStorage.getItem(this.storageKey));
            return Array.isArray(websites) ? websites : [];
        } catch (error) {
            console.error('Error loading websites from storage:', error);
            return [];
        }
    }

    /**
     * Save websites to localStorage
     */
    saveWebsites() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.websites));
        } catch (error) {
            console.error('Error saving websites to storage:', error);
        }
    }

    /**
     * Get all websites
     * @returns {Array} Array of website objects
     */
    getAllWebsites() {
        return [...this.websites];
    }

    /**
     * Get website by ID
     * @param {String} id Website ID
     * @returns {Object|null} Website object or null if not found
     */
    getWebsiteById(id) {
        return this.websites.find(website => website.id === id) || null;
    }

    /**
     * Get websites by category
     * @param {String} category Category name
     * @returns {Array} Array of website objects filtered by category
     */
    getWebsitesByCategory(category) {
        return this.websites.filter(website => website.category === category);
    }

    /**
     * Get favorite websites
     * @returns {Array} Array of website objects that are marked as favorites
     */
    getFavoriteWebsites() {
        return this.websites.filter(website => website.isFavorite);
    }

    /**
     * Get recently added websites (last 10)
     * @returns {Array} Array of the 10 most recently added website objects
     */
    getRecentWebsites() {
        return [...this.websites]
            .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
            .slice(0, 10);
    }

    /**
     * Add a new website
     * @param {Object} websiteData Website data object
     * @returns {Object} Added website object with generated ID
     */
    addWebsite(websiteData) {
        const newWebsite = {
            id: this.generateId(),
            name: websiteData.name.trim(),
            url: this.formatUrl(websiteData.url),
            category: websiteData.category,
            isFavorite: websiteData.isFavorite || false,
            dateAdded: new Date().toISOString(),
            thumbnail: websiteData.thumbnail || null
        };

        this.websites.unshift(newWebsite);
        this.saveWebsites();
        return newWebsite;
    }

    /**
     * Update an existing website
     * @param {String} id Website ID
     * @param {Object} websiteData Updated website data
     * @returns {Object|null} Updated website object or null if not found
     */
    updateWebsite(id, websiteData) {
        const index = this.websites.findIndex(website => website.id === id);
        
        if (index === -1) {
            return null;
        }

        const updatedWebsite = {
            ...this.websites[index],
            name: websiteData.name.trim(),
            url: this.formatUrl(websiteData.url),
            category: websiteData.category,
            isFavorite: websiteData.isFavorite,
            dateModified: new Date().toISOString()
        };

        this.websites[index] = updatedWebsite;
        this.saveWebsites();
        return updatedWebsite;
    }

    /**
     * Delete a website
     * @param {String} id Website ID
     * @returns {Boolean} True if deleted successfully, false otherwise
     */
    deleteWebsite(id) {
        const initialLength = this.websites.length;
        this.websites = this.websites.filter(website => website.id !== id);
        
        if (this.websites.length !== initialLength) {
            this.saveWebsites();
            return true;
        }
        
        return false;
    }

    /**
     * Toggle favorite status of a website
     * @param {String} id Website ID
     * @returns {Object|null} Updated website object or null if not found
     */
    toggleFavorite(id) {
        const index = this.websites.findIndex(website => website.id === id);
        
        if (index === -1) {
            return null;
        }

        this.websites[index].isFavorite = !this.websites[index].isFavorite;
        this.saveWebsites();
        return this.websites[index];
    }

    /**
     * Search websites by name or URL
     * @param {String} query Search query
     * @returns {Array} Array of matching website objects
     */
    searchWebsites(query) {
        if (!query) {
            return this.getAllWebsites();
        }
        
        const searchTerm = query.toLowerCase().trim();
        return this.websites.filter(website => 
            website.name.toLowerCase().includes(searchTerm) || 
            website.url.toLowerCase().includes(searchTerm)
        );
    }

    /**
     * Sort websites by specified criteria
     * @param {Array} websites Array of website objects to sort
     * @param {String} sortBy Sort criterion ('name-asc', 'name-desc', 'date-new', 'date-old')
     * @returns {Array} Sorted array of website objects
     */
    sortWebsites(websites, sortBy) {
        const websitesCopy = [...websites];
        
        switch (sortBy) {
            case 'name-asc':
                return websitesCopy.sort((a, b) => a.name.localeCompare(b.name));
            case 'name-desc':
                return websitesCopy.sort((a, b) => b.name.localeCompare(a.name));
            case 'date-new':
                return websitesCopy.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            case 'date-old':
                return websitesCopy.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
            default:
                return websitesCopy;
        }
    }

    /**
     * Filter websites by category
     * @param {Array} websites Array of website objects to filter
     * @param {String} filter Filter criterion ('all', 'work', 'personal', etc.)
     * @returns {Array} Filtered array of website objects
     */
    filterWebsites(websites, filter) {
        if (filter === 'all') {
            return websites;
        }
        
        return websites.filter(website => website.category === filter);
    }

    /**
     * Generate a unique ID for a new website
     * @returns {String} Unique ID
     */
    generateId() {
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    }

    /**
     * Format URL to ensure it has the correct protocol
     * @param {String} url URL to format
     * @returns {String} Formatted URL
     */
    formatUrl(url) {
        url = url.trim();
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        return url;
    }
}

// Create and export a single instance of the StorageManager
const storageManager = new StorageManager();
