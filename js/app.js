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

        // Render initial websites
        uiManager.renderWebsites();

        // Add demo data if first time
        this.checkFirstRun();

        // Initialize sample websites if none exist
        this.initSampleIfEmpty();

        // Add web category websites
        this.addWebWebsites();

        // Initialize continuous star animation
        this.initStarAnimation();
    }

    initStarAnimation() {
        const starField = document.getElementById('starField');
        const createStar = () => {
            const star = document.createElement('div');
            star.className = 'star';

            // Random starting position across full width
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = '-5px';  // Start just above viewport

            // Random size
            const size = Math.random() * 3 + 1;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;

            // Random speed
            const duration = Math.random() * 3 + 2;
            star.style.animation = `starFall ${duration}s linear`;

            // Random color
            const colors = ['star-purple', 'star-teal', 'star-orange', 'star-blue', 'star-pink'];
            star.classList.add(colors[Math.floor(Math.random() * colors.length)]);

            starField.appendChild(star);

            // Remove star after animation completes
            star.addEventListener('animationend', () => {
                star.remove();
            });
        };

        // Create stars continuously
        setInterval(createStar, 100);  // Create a new star every 100ms
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

                // Others Category
                {
                    name: 'Instagram',
                    url: 'https://instagram.com',
                    category: 'others',
                    description: 'Photo and video sharing social networking service owned by Meta Platforms.',
                    thumbnailUrl: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=600'
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