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
        // Always start with a clean slate for testing purposes
        localStorage.removeItem('linkVaultWebsites');
        
        // Initialize custom cursor with glowing trail
        this.initCustomCursor();
        
        // Render initial websites
        uiManager.renderWebsites();
        
        // Add demo data if first time
        this.checkFirstRun();
        
        // Initialize sample websites if none exist
        this.initSampleIfEmpty();
        
        // Add web category websites
        this.addWebWebsites();
    }
    
    /**
     * Initialize custom cursor with glowing trail
     */
    initCustomCursor() {
        // Create cursor elements
        const cursorDot = document.createElement('div');
        cursorDot.className = 'cursor-dot';
        
        const cursorDotOutline = document.createElement('div');
        cursorDotOutline.className = 'cursor-dot-outline';
        
        // Hide cursors initially until mouse moves
        cursorDot.style.opacity = '0';
        cursorDotOutline.style.opacity = '0';
        
        // Create trail container
        const trailsContainer = document.createElement('div');
        trailsContainer.id = 'trails-container';
        trailsContainer.style.position = 'fixed';
        trailsContainer.style.top = '0';
        trailsContainer.style.left = '0';
        trailsContainer.style.width = '100%';
        trailsContainer.style.height = '100%';
        trailsContainer.style.pointerEvents = 'none';
        trailsContainer.style.zIndex = '9997';
        trailsContainer.style.overflow = 'hidden';
        
        // Add elements to body
        document.body.appendChild(trailsContainer);
        document.body.appendChild(cursorDot);
        document.body.appendChild(cursorDotOutline);
        
        // Initialize variables for trails
        let lastX = 0;
        let lastY = 0;
        let trailElements = [];
        const MAX_TRAILS = 15;
        let isFirstMove = true;
        
        // Handle mouse movement
        document.addEventListener('mousemove', (e) => {
            // Show cursors on first mouse move
            if (isFirstMove) {
                cursorDot.style.opacity = '1';
                cursorDotOutline.style.opacity = '1';
                isFirstMove = false;
            }
            
            // Update cursor position exactly at the mouse pointer
            requestAnimationFrame(() => {
                cursorDot.style.left = `${e.clientX}px`;
                cursorDot.style.top = `${e.clientY}px`;
                
                // Follow the cursor dot with a slight delay for outline effect
                cursorDotOutline.style.left = `${e.clientX - 12}px`;
                cursorDotOutline.style.top = `${e.clientY - 12}px`;
            });
            
            // Calculate distance moved
            const dist = Math.sqrt(Math.pow(e.clientX - lastX, 2) + Math.pow(e.clientY - lastY, 2));
            
            // Create trail if moved enough distance
            if (dist > 15) {
                createTrail(e.clientX, e.clientY);
                lastX = e.clientX;
                lastY = e.clientY;
            }
        });
        
        // Handle cursor for links and clickable elements
        document.addEventListener('mousedown', () => {
            cursorDot.style.transform = 'scale(0.7)';
            cursorDotOutline.style.transform = 'scale(1.4)';
        });
        
        document.addEventListener('mouseup', () => {
            cursorDot.style.transform = 'scale(1)';
            cursorDotOutline.style.transform = 'scale(1)';
        });
        
        // Handle elements that should have a different cursor
        document.addEventListener('mouseover', (e) => {
            const targetElement = e.target;
            
            if (targetElement.closest('a, button, .website-card, .sidebar-item, input[type="submit"], select, .dropdown-btn, label')) {
                document.body.classList.add('clickable-active');
            } else {
                document.body.classList.remove('clickable-active');
            }
        });
        
        // Handle window blur/focus
        document.addEventListener('mouseout', () => {
            cursorDot.style.opacity = '0';
            cursorDotOutline.style.opacity = '0';
        });
        
        document.addEventListener('mouseover', () => {
            cursorDot.style.opacity = '1';
            cursorDotOutline.style.opacity = '1';
        });
        
        // Function to create trail element
        function createTrail(x, y) {
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            trail.style.left = `${x}px`;
            trail.style.top = `${y}px`;
            
            // Add some randomization to the trail
            const size = Math.random() * 5 + 3; // Random size between 3-8px
            const opacity = Math.random() * 0.4 + 0.2; // Random opacity
            
            trail.style.width = `${size}px`;
            trail.style.height = `${size}px`;
            trail.style.opacity = opacity.toString();
            
            trailsContainer.appendChild(trail);
            trailElements.push(trail);
            
            // Fade out and remove
            setTimeout(() => {
                trail.style.opacity = '0';
                trail.style.width = '1px';
                trail.style.height = '1px';
                
                setTimeout(() => {
                    if (trail.parentNode === trailsContainer) {
                        trailsContainer.removeChild(trail);
                    }
                    trailElements = trailElements.filter(e => e !== trail);
                }, 600);
            }, 100);
            
            // Limit max trails
            if (trailElements.length > MAX_TRAILS) {
                if (trailElements[0].parentNode === trailsContainer) {
                    trailsContainer.removeChild(trailElements[0]);
                }
                trailElements.shift();
            }
        }
    }
    
    /**
     * Add web-related websites to the collection
     */
    addWebWebsites() {
        // First clear any existing websites in the 'web' category
        this.clearWebCategory();
        
        const webWebsites = [
            // Icon websites
            {
                name: 'Noticons',
                url: 'https://www.noticons.com/',
                category: 'web',
                description: 'Beautiful icon collection for web design',
                thumbnailUrl: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600'
            },
            {
                name: 'FLATICON',
                url: 'https://www.flaticon.com/',
                category: 'web',
                description: 'Free vector icons and stickers',
                thumbnailUrl: 'https://images.pexels.com/photos/5473955/pexels-photo-5473955.jpeg?auto=compress&cs=tinysrgb&w=600'
            },
            {
                name: 'PHOSPHOR',
                url: 'https://phosphoricons.com/',
                category: 'web',
                description: 'Flexible icon family for interfaces',
                thumbnailUrl: 'https://images.pexels.com/photos/5474295/pexels-photo-5474295.jpeg?auto=compress&cs=tinysrgb&w=600'
            },
            {
                name: 'THE NOUN PROJECT',
                url: 'https://getcustomblocks.com/',
                category: 'web',
                description: 'Custom blocks for designing websites',
                thumbnailUrl: 'https://images.pexels.com/photos/5935794/pexels-photo-5935794.jpeg?auto=compress&cs=tinysrgb&w=600'
            },
            {
                name: 'SUPER',
                url: 'https://super.so/icons',
                category: 'web',
                description: 'Super icons collection for websites',
                thumbnailUrl: 'https://images.pexels.com/photos/5926389/pexels-photo-5926389.jpeg?auto=compress&cs=tinysrgb&w=600'
            },
            {
                name: 'SIMPLE',
                url: 'https://notionicons.simple.ink/',
                category: 'web',
                description: 'Simple icons for Notion pages',
                thumbnailUrl: 'https://images.pexels.com/photos/5926382/pexels-photo-5926382.jpeg?auto=compress&cs=tinysrgb&w=600'
            },
            {
                name: 'FEATHER ICONS',
                url: 'https://feathericons.com/',
                category: 'web',
                description: 'Beautiful, customizable icons',
                thumbnailUrl: 'https://images.pexels.com/photos/5926395/pexels-photo-5926395.jpeg?auto=compress&cs=tinysrgb&w=600'
            },
            
            // UI Framework websites
            {
                name: 'Chakra UI',
                url: 'https://chakra-ui.com/',
                category: 'web',
                description: 'Simple, modular component library',
                thumbnailUrl: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=600'
            },
            {
                name: 'Daisy UI',
                url: 'https://daisyui.com/',
                category: 'web',
                description: 'Tailwind CSS component library',
                thumbnailUrl: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=600'
            },
            {
                name: 'Mantine',
                url: 'https://mantine.dev/',
                category: 'web',
                description: 'React components and hooks library',
                thumbnailUrl: 'https://images.pexels.com/photos/11035516/pexels-photo-11035516.jpeg?auto=compress&cs=tinysrgb&w=600'
            },
            {
                name: 'Headless UI',
                url: 'https://headlessui.com/',
                category: 'web',
                description: 'Unstyled UI components for React',
                thumbnailUrl: 'https://images.pexels.com/photos/11035381/pexels-photo-11035381.jpeg?auto=compress&cs=tinysrgb&w=600'
            },
            {
                name: 'Hero UI',
                url: 'https://www.heroui.com/',
                category: 'web',
                description: 'Customizable UI component library',
                thumbnailUrl: 'https://images.pexels.com/photos/11035382/pexels-photo-11035382.jpeg?auto=compress&cs=tinysrgb&w=600'
            },
            {
                name: 'UI Shadcn',
                url: 'https://ui.shadcn.com/',
                category: 'web',
                description: 'Shadcn beautiful UI components',
                thumbnailUrl: 'https://images.pexels.com/photos/11035384/pexels-photo-11035384.jpeg?auto=compress&cs=tinysrgb&w=600'
            },
            {
                name: 'Material UI',
                url: 'https://mui.com/material-ui/getting-started/',
                category: 'web',
                description: 'React components for faster development',
                thumbnailUrl: 'https://images.pexels.com/photos/11035385/pexels-photo-11035385.jpeg?auto=compress&cs=tinysrgb&w=600'
            },
            {
                name: 'Universe.io',
                url: 'https://universe.io/elements',
                category: 'web',
                description: 'UI elements for creative websites',
                thumbnailUrl: 'https://images.pexels.com/photos/11035383/pexels-photo-11035383.jpeg?auto=compress&cs=tinysrgb&w=600'
            }
        ];
        
        // Add all web websites
        webWebsites.forEach(website => {
            storageManager.addWebsite(website);
        });
        
        // Re-render the website display
        uiManager.renderWebsites();
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
     * Clear all websites in the web category
     */
    clearWebCategory() {
        const allWebsites = storageManager.getAllWebsites();
        const nonWebWebsites = allWebsites.filter(website => website.category !== 'web');
        
        // Replace all websites with only non-web websites
        storageManager.websites = nonWebWebsites;
        storageManager.saveWebsites();
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
