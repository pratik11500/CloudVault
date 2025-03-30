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
                    thumbnailUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
                },
                {
                    name: 'Google Bard',
                    url: 'https://bard.google.com',
                    category: 'ai',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1655720031554-a929595b5004?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
                },
                {
                    name: 'Hugging Face',
                    url: 'https://huggingface.co',
                    category: 'ai',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1676999661373-e92b4f5dca19?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
                },
                
                // Photos Category
                {
                    name: 'Unsplash',
                    url: 'https://unsplash.com',
                    category: 'photos',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1554147090-e1221a04a025?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
                },
                {
                    name: 'Pexels',
                    url: 'https://pexels.com',
                    category: 'photos',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1545240932-9fe0994097ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
                },
                {
                    name: 'Flickr',
                    url: 'https://flickr.com',
                    category: 'photos',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
                },
                
                // Videos Category
                {
                    name: 'YouTube',
                    url: 'https://youtube.com',
                    category: 'videos',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
                },
                {
                    name: 'Vimeo',
                    url: 'https://vimeo.com',
                    category: 'videos',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1578022761797-b8636ac1773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
                },
                {
                    name: 'TikTok',
                    url: 'https://tiktok.com',
                    category: 'videos',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1586861636835-182c95f909ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
                },
                
                // Hacks Category
                {
                    name: 'GitHub',
                    url: 'https://github.com',
                    category: 'hacks',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
                },
                {
                    name: 'Stack Overflow',
                    url: 'https://stackoverflow.com',
                    category: 'hacks',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
                },
                {
                    name: 'CodePen',
                    url: 'https://codepen.io',
                    category: 'hacks',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1617042375876-a13e36732a04?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
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
