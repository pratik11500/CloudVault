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
        // For testing purposes - clear local storage to reset data
        localStorage.removeItem('linkVaultWebsites');
        
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
                    description: 'Leading AI research lab creating powerful language models and tools.',
                    thumbnailUrl: 'https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg?auto=compress&cs=tinysrgb&w=600'
                },
                {
                    name: 'Google Bard',
                    url: 'https://bard.google.com',
                    category: 'ai',
                    description: 'Google\'s experimental conversational AI service powered by LaMDA.',
                    thumbnailUrl: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=600'
                },
                {
                    name: 'Hugging Face',
                    url: 'https://huggingface.co',
                    category: 'ai',
                    description: 'Community platform for sharing machine learning models and datasets.',
                    thumbnailUrl: 'https://images.pexels.com/photos/2599245/pexels-photo-2599245.jpeg?auto=compress&cs=tinysrgb&w=600'
                },
                {
                    name: 'Anthropic Claude',
                    url: 'https://claude.ai',
                    category: 'ai',
                    description: 'Advanced AI assistant focused on being helpful, harmless, and honest.',
                    thumbnailUrl: 'https://images.pexels.com/photos/8294554/pexels-photo-8294554.jpeg?auto=compress&cs=tinysrgb&w=600'
                },
                
                // Photos Category
                {
                    name: 'Unsplash',
                    url: 'https://unsplash.com',
                    category: 'photos',
                    description: 'Beautiful, free photos contributed by creators around the world.',
                    thumbnailUrl: 'https://images.pexels.com/photos/1496373/pexels-photo-1496373.jpeg?auto=compress&cs=tinysrgb&w=600'
                },
                {
                    name: 'Pexels',
                    url: 'https://pexels.com',
                    category: 'photos',
                    description: 'Free stock photos, royalty-free images & videos shared by creators.',
                    thumbnailUrl: 'https://images.pexels.com/photos/3817676/pexels-photo-3817676.jpeg?auto=compress&cs=tinysrgb&w=600'
                },
                {
                    name: 'Flickr',
                    url: 'https://flickr.com',
                    category: 'photos',
                    description: 'Photo-sharing platform and community with millions of images.',
                    thumbnailUrl: 'https://images.pexels.com/photos/3844788/pexels-photo-3844788.jpeg?auto=compress&cs=tinysrgb&w=600'
                },
                {
                    name: 'Pixabay',
                    url: 'https://pixabay.com',
                    category: 'photos',
                    description: 'Over 2.6 million high-quality stock images, videos and music shared by community.',
                    thumbnailUrl: 'https://images.pexels.com/photos/3534924/pexels-photo-3534924.jpeg?auto=compress&cs=tinysrgb&w=600'
                },
                
                // Videos Category
                {
                    name: 'YouTube',
                    url: 'https://youtube.com',
                    category: 'videos',
                    description: 'World\'s largest video sharing platform with billions of videos.',
                    thumbnailUrl: 'https://images.pexels.com/photos/3379942/pexels-photo-3379942.jpeg?auto=compress&cs=tinysrgb&w=600'
                },
                {
                    name: 'Vimeo',
                    url: 'https://vimeo.com',
                    category: 'videos',
                    description: 'High-quality video hosting platform for professionals and creators.',
                    thumbnailUrl: 'https://images.pexels.com/photos/7257770/pexels-photo-7257770.jpeg?auto=compress&cs=tinysrgb&w=600'
                },
                {
                    name: 'TikTok',
                    url: 'https://tiktok.com',
                    category: 'videos',
                    description: 'Short-form, video-sharing app for trending clips and challenges.',
                    thumbnailUrl: 'https://images.pexels.com/photos/6953868/pexels-photo-6953868.jpeg?auto=compress&cs=tinysrgb&w=600'
                },
                {
                    name: 'Netflix',
                    url: 'https://netflix.com',
                    category: 'videos',
                    description: 'Subscription-based streaming service with movies, TV shows, and originals.',
                    thumbnailUrl: 'https://images.pexels.com/photos/987586/pexels-photo-987586.jpeg?auto=compress&cs=tinysrgb&w=600'
                },
                
                // Hacks Category
                {
                    name: 'GitHub',
                    url: 'https://github.com',
                    category: 'hacks',
                    description: 'World\'s leading software development platform using Git version control.',
                    thumbnailUrl: 'https://images.pexels.com/photos/11035386/pexels-photo-11035386.jpeg?auto=compress&cs=tinysrgb&w=600'
                },
                {
                    name: 'Stack Overflow',
                    url: 'https://stackoverflow.com',
                    category: 'hacks',
                    description: 'Community for developers to learn, share knowledge, and build careers.',
                    thumbnailUrl: 'https://images.pexels.com/photos/169573/pexels-photo-169573.jpeg?auto=compress&cs=tinysrgb&w=600'
                },
                {
                    name: 'CodePen',
                    url: 'https://codepen.io',
                    category: 'hacks',
                    description: 'Social development environment for front-end designers and developers.',
                    thumbnailUrl: 'https://images.pexels.com/photos/4709289/pexels-photo-4709289.jpeg?auto=compress&cs=tinysrgb&w=600'
                },
                {
                    name: 'Replit',
                    url: 'https://replit.com',
                    category: 'hacks',
                    description: 'Collaborative browser-based IDE supporting 50+ programming languages.',
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
