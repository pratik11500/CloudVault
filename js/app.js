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
            // No sample data by default, user will create their own
            // This follows the guideline to not include mock/example data
        }
    }
}

// Initialize application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
