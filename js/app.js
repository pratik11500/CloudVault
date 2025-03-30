/**
 * Main Application
 * Handles the initialization and coordination of other modules
 */
class App {
    constructor() {
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        // Render initial websites
        uiManager.renderWebsites();
        
        // Add demo data if first time
        this.checkFirstRun();
        
        // Initialize sample websites if none exist
        this.initSampleIfEmpty();
    }

    /**
     * Check if this is the first run of the application
     */
    checkFirstRun() {
        if (!localStorage.getItem('linkVaultFirstRun')) {
            // Show welcome toast
            uiManager.showToast('Welcome to LinkVault! Hover over items to see animations and features.', 'info', 5000);
            localStorage.setItem('linkVaultFirstRun', 'done');
        }
    }

    /**
     * Initialize sample websites if none exist
     */
    initSampleIfEmpty() {
        const websites = storageManager.getAllWebsites();
        
        if (websites.length === 0) {
            // Add sample websites for each category
            const sampleWebsites = [
                // AI Category
                {
                    name: 'OpenAI',
                    url: 'https://openai.com',
                    category: 'ai',
                    isFavorite: true
                },
                {
                    name: 'Google Bard',
                    url: 'https://bard.google.com',
                    category: 'ai',
                    isFavorite: false
                },
                {
                    name: 'Hugging Face',
                    url: 'https://huggingface.co',
                    category: 'ai',
                    isFavorite: false
                },
                
                // Photos Category
                {
                    name: 'Unsplash',
                    url: 'https://unsplash.com',
                    category: 'photos',
                    isFavorite: true
                },
                {
                    name: 'Pexels',
                    url: 'https://pexels.com',
                    category: 'photos',
                    isFavorite: false
                },
                {
                    name: 'Flickr',
                    url: 'https://flickr.com',
                    category: 'photos',
                    isFavorite: false
                },
                
                // Videos Category
                {
                    name: 'YouTube',
                    url: 'https://youtube.com',
                    category: 'videos',
                    isFavorite: true
                },
                {
                    name: 'Vimeo',
                    url: 'https://vimeo.com',
                    category: 'videos',
                    isFavorite: false
                },
                {
                    name: 'TikTok',
                    url: 'https://tiktok.com',
                    category: 'videos',
                    isFavorite: false
                },
                
                // Hacks Category
                {
                    name: 'GitHub',
                    url: 'https://github.com',
                    category: 'hacks',
                    isFavorite: true
                },
                {
                    name: 'Stack Overflow',
                    url: 'https://stackoverflow.com',
                    category: 'hacks',
                    isFavorite: false
                },
                {
                    name: 'CodePen',
                    url: 'https://codepen.io',
                    category: 'hacks',
                    isFavorite: false
                }
            ];
            
            // Add all sample websites
            sampleWebsites.forEach(website => {
                storageManager.addWebsite(website);
            });
            
            // Re-render the website display
            uiManager.renderWebsites();
        }
    }
}

// Initialize application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
