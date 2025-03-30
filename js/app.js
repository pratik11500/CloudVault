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
                    thumbnailUrl: 'https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg?auto=compress&cs=tinysrgb&w=600'
                },
                {
                    name: 'Google Bard',
                    url: 'https://bard.google.com',
                    category: 'ai',
                    thumbnailUrl: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=600'
                },
                {
                    name: 'Hugging Face',
                    url: 'https://huggingface.co',
                    category: 'ai',
                    thumbnailUrl: 'https://images.pexels.com/photos/2599245/pexels-photo-2599245.jpeg?auto=compress&cs=tinysrgb&w=600'
                },
                {
                    name: 'Anthropic Claude',
                    url: 'https://claude.ai',
                    category: 'ai',
                    thumbnailUrl: 'https://images.pexels.com/photos/8294554/pexels-photo-8294554.jpeg?auto=compress&cs=tinysrgb&w=600'
                },
                
                // Photos Category
                {
                    name: 'Unsplash',
                    url: 'https://unsplash.com',
                    category: 'photos',
                    thumbnailUrl: 'https://images.pexels.com/photos/1496373/pexels-photo-1496373.jpeg?auto=compress&cs=tinysrgb&w=600'
                },
                {
                    name: 'Pexels',
                    url: 'https://pexels.com',
                    category: 'photos',
                    thumbnailUrl: 'https://images.pexels.com/photos/3817676/pexels-photo-3817676.jpeg?auto=compress&cs=tinysrgb&w=600'
                },
                {
                    name: 'Flickr',
                    url: 'https://flickr.com',
                    category: 'photos',
                    thumbnailUrl: 'https://images.pexels.com/photos/3844788/pexels-photo-3844788.jpeg?auto=compress&cs=tinysrgb&w=600'
                },
                {
                    name: 'Pixabay',
                    url: 'https://pixabay.com',
                    category: 'photos',
                    thumbnailUrl: 'https://images.pexels.com/photos/3534924/pexels-photo-3534924.jpeg?auto=compress&cs=tinysrgb&w=600'
                },
                
                // Videos Category
                {
                    name: 'YouTube',
                    url: 'https://youtube.com',
                    category: 'videos',
                    thumbnailUrl: 'https://images.pexels.com/photos/3379942/pexels-photo-3379942.jpeg?auto=compress&cs=tinysrgb&w=600'
                },
                {
                    name: 'Vimeo',
                    url: 'https://vimeo.com',
                    category: 'videos',
                    thumbnailUrl: 'https://images.pexels.com/photos/7257770/pexels-photo-7257770.jpeg?auto=compress&cs=tinysrgb&w=600'
                },
                {
                    name: 'TikTok',
                    url: 'https://tiktok.com',
                    category: 'videos',
                    thumbnailUrl: 'https://images.pexels.com/photos/6953868/pexels-photo-6953868.jpeg?auto=compress&cs=tinysrgb&w=600'
                },
                {
                    name: 'Netflix',
                    url: 'https://netflix.com',
                    category: 'videos',
                    thumbnailUrl: 'https://images.pexels.com/photos/987586/pexels-photo-987586.jpeg?auto=compress&cs=tinysrgb&w=600'
                },
                
                // Hacks Category
                {
                    name: 'GitHub',
                    url: 'https://github.com',
                    category: 'hacks',
                    thumbnailUrl: 'https://images.pexels.com/photos/11035386/pexels-photo-11035386.jpeg?auto=compress&cs=tinysrgb&w=600'
                },
                {
                    name: 'Stack Overflow',
                    url: 'https://stackoverflow.com',
                    category: 'hacks',
                    thumbnailUrl: 'https://images.pexels.com/photos/169573/pexels-photo-169573.jpeg?auto=compress&cs=tinysrgb&w=600'
                },
                {
                    name: 'CodePen',
                    url: 'https://codepen.io',
                    category: 'hacks',
                    thumbnailUrl: 'https://images.pexels.com/photos/4709289/pexels-photo-4709289.jpeg?auto=compress&cs=tinysrgb&w=600'
                },
                {
                    name: 'Replit',
                    url: 'https://replit.com',
                    category: 'hacks',
                    thumbnailUrl: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=600'
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
