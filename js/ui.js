/**
 * UI Manager
 * Handles all user interface interactions and rendering
 */
class UIManager {
    constructor() {
        // DOM Elements
        this.websitesContainer = document.getElementById('websitesContainer');
        this.emptyState = document.getElementById('emptyState');
        this.searchInput = document.getElementById('search-input');
        this.gridViewBtn = document.getElementById('grid-view');
        this.listViewBtn = document.getElementById('list-view');
        this.menuToggle = document.getElementById('menuToggle');
        this.sidebar = document.querySelector('.sidebar');
        this.navItems = document.querySelectorAll('.nav-item');
        this.addWebsiteModal = document.getElementById('addWebsiteModal');
        this.editWebsiteModal = document.getElementById('editWebsiteModal');
        this.confirmDeleteModal = document.getElementById('confirmDeleteModal');
        this.addWebsiteForm = document.getElementById('addWebsiteForm');
        this.editWebsiteForm = document.getElementById('editWebsiteForm');
        this.toastContainer = document.getElementById('toastContainer');
        this.starField = document.getElementById('starField');
        
        // Current state
        this.currentView = 'grid'; // grid or list
        this.currentSection = 'all'; // all, favorites, recent, etc.
        this.currentFilter = 'all'; // all, work, personal, etc.
        this.currentSort = 'date-new'; // name-asc, name-desc, date-new, date-old
        this.currentWebsiteId = null; // For editing
        
        // Init
        this.initEventListeners();
        this.createStars();
    }

    /**
     * Initialize all event listeners
     */
    initEventListeners() {
        // View toggle
        this.gridViewBtn.addEventListener('click', () => this.changeView('grid'));
        this.listViewBtn.addEventListener('click', () => this.changeView('list'));
        
        // Menu toggle
        this.menuToggle.addEventListener('click', () => this.toggleSidebar());
        
        // Search input
        this.searchInput.addEventListener('input', () => this.handleSearch());
        
        // Navigation
        this.navItems.forEach(item => {
            item.addEventListener('click', () => {
                const section = item.dataset.section;
                this.changeSection(section);
            });
        });
        
        // Window resize event for stars regeneration
        window.addEventListener('resize', () => {
            this.createStars();
        });
        
        // Filter and Sort
        document.querySelectorAll('[data-filter]').forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                this.applyFilter(element.dataset.filter);
            });
        });
        
        document.querySelectorAll('[data-sort]').forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                this.applySort(element.dataset.sort);
            });
        });
        
        // Add Website is removed as per user request
        document.getElementById('closeAddModal').addEventListener('click', () => this.closeAddWebsiteModal());
        document.getElementById('cancelAddWebsite').addEventListener('click', () => this.closeAddWebsiteModal());
        this.addWebsiteForm.addEventListener('submit', (e) => this.handleAddWebsite(e));
        
        // Edit Website
        document.getElementById('closeEditModal').addEventListener('click', () => this.closeEditWebsiteModal());
        document.getElementById('cancelEditWebsite').addEventListener('click', () => this.closeEditWebsiteModal());
        this.editWebsiteForm.addEventListener('submit', (e) => this.handleEditWebsite(e));
        document.getElementById('deleteWebsite').addEventListener('click', () => this.openConfirmDeleteModal());
        
        // Confirm Delete
        document.getElementById('closeConfirmModal').addEventListener('click', () => this.closeConfirmDeleteModal());
        document.getElementById('cancelDelete').addEventListener('click', () => this.closeConfirmDeleteModal());
        document.getElementById('confirmDelete').addEventListener('click', () => this.handleDeleteWebsite());
    }

    /**
     * Change the current view (grid or list)
     * @param {String} view View type ('grid' or 'list')
     */
    changeView(view) {
        if (this.currentView === view) return;
        
        this.currentView = view;
        
        if (view === 'grid') {
            this.websitesContainer.classList.remove('list-view');
            this.websitesContainer.classList.add('grid-view');
            this.gridViewBtn.classList.add('active');
            this.listViewBtn.classList.remove('active');
        } else {
            this.websitesContainer.classList.remove('grid-view');
            this.websitesContainer.classList.add('list-view');
            this.gridViewBtn.classList.remove('active');
            this.listViewBtn.classList.add('active');
        }
        
        this.renderWebsites(); // Re-render to adjust layouts
    }

    /**
     * Toggle sidebar expanded/collapsed state
     */
    toggleSidebar() {
        this.sidebar.classList.toggle('sidebar-collapsed');
        this.menuToggle.classList.toggle('active');
        
        // Adjust content margin
        const content = document.querySelector('.content');
        if (this.sidebar.classList.contains('sidebar-collapsed')) {
            content.style.marginLeft = 'var(--sidebar-collapsed-width)';
        } else {
            content.style.marginLeft = 'var(--sidebar-width)';
        }
    }

    /**
     * Change the current section
     * @param {String} section Section name
     */
    changeSection(section) {
        if (this.currentSection === section) return;
        
        // Update active nav item
        this.navItems.forEach(item => {
            if (item.dataset.section === section) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        this.currentSection = section;
        this.renderWebsites();
    }

    /**
     * Handle search input
     */
    handleSearch() {
        const query = this.searchInput.value;
        this.renderWebsites(query);
    }

    /**
     * Apply filter to websites
     * @param {String} filter Filter name
     */
    applyFilter(filter) {
        this.currentFilter = filter;
        this.renderWebsites();
    }

    /**
     * Apply sort to websites
     * @param {String} sort Sort name
     */
    applySort(sort) {
        this.currentSort = sort;
        this.renderWebsites();
    }

    /**
     * Get websites based on current section
     * @returns {Array} Array of website objects
     */
    getWebsitesByCurrentSection() {
        switch (this.currentSection) {
            case 'photos':
                return storageManager.getWebsitesByCategory('photos');
            case 'videos':
                return storageManager.getWebsitesByCategory('videos');
            case 'hacks':
                return storageManager.getWebsitesByCategory('hacks');
            case 'ai':
                return storageManager.getWebsitesByCategory('ai');
            case 'contact':
                // We'll handle the contact section differently
                this.renderContactPage();
                return [];
            case 'all':
                // All websites from all categories
                return storageManager.getAllWebsites();
            default: // 'all'
                return storageManager.getAllWebsites();
        }
    }
    
    /**
     * Render the contact page
     */
    renderContactPage() {
        // Clear the container
        this.websitesContainer.innerHTML = '';
        
        // Create contact page container
        const contactContainer = document.createElement('div');
        contactContainer.className = 'contact-container';
        
        // Create header section
        const headerSection = document.createElement('div');
        headerSection.className = 'contact-header';
        
        const header = document.createElement('h1');
        header.textContent = 'Connect With Us';
        
        const description = document.createElement('p');
        description.textContent = 'Have questions or suggestions about LinkVault? We\'d love to hear from you! Choose how you\'d like to connect with our team below.';
        
        headerSection.appendChild(header);
        headerSection.appendChild(description);
        
        // Create contact cards container
        const contactCards = document.createElement('div');
        contactCards.className = 'contact-cards';
        
        // Email contact card
        const emailCard = this.createContactCard(
            'fas fa-envelope', 
            'Email Support', 
            'support@linkvault.com', 
            'Our support team typically responds within 24 hours to all inquiries. We\'re here to help with any questions about our service!'
        );
        
        // GitHub card
        const githubCard = this.createContactCard(
            'fab fa-github', 
            'GitHub', 
            'github.com/linkvault', 
            'Check out our open source projects, report bugs, or contribute to the development of LinkVault on our GitHub page.'
        );
        
        // Twitter card
        const twitterCard = this.createContactCard(
            'fab fa-twitter', 
            'Twitter', 
            '@LinkVault', 
            'Follow us for the latest updates, tips and tricks. You can also reach out to us directly through Twitter for quick responses.'
        );
        
        // Discord card
        const discordCard = this.createContactCard(
            'fab fa-discord', 
            'Discord Community', 
            'discord.gg/linkvault', 
            'Join our Discord community to chat with other users, share your website collections, and get help from our team.'
        );
        
        // Append all cards to container
        contactCards.appendChild(emailCard);
        contactCards.appendChild(githubCard);
        contactCards.appendChild(twitterCard);
        contactCards.appendChild(discordCard);
        
        // Create social links section
        const socialLinks = document.createElement('div');
        socialLinks.className = 'social-links';
        
        // Add social media links
        const socialPlatforms = [
            { icon: 'fab fa-github', url: 'https://github.com' },
            { icon: 'fab fa-twitter', url: 'https://twitter.com' },
            { icon: 'fab fa-discord', url: 'https://discord.com' },
            { icon: 'fab fa-youtube', url: 'https://youtube.com' },
            { icon: 'fab fa-reddit', url: 'https://reddit.com' }
        ];
        
        socialPlatforms.forEach(platform => {
            const link = document.createElement('a');
            link.className = 'social-link';
            link.href = platform.url;
            link.target = '_blank';
            link.innerHTML = `<i class="${platform.icon}"></i>`;
            socialLinks.appendChild(link);
        });
        
        // Append all elements to the contact container
        contactContainer.appendChild(headerSection);
        contactContainer.appendChild(contactCards);
        contactContainer.appendChild(socialLinks);
        
        // Append contact container to the main container
        this.websitesContainer.appendChild(contactContainer);
    }
    
    /**
     * Create a contact card for the contact page
     * @param {String} iconClass FontAwesome icon class
     * @param {String} title Card title
     * @param {String} info Contact information
     * @param {String} description Card description
     * @returns {HTMLElement} Created contact card
     */
    createContactCard(iconClass, title, info, description) {
        const card = document.createElement('div');
        card.className = 'contact-card';
        
        card.innerHTML = `
            <div class="contact-card-icon">
                <i class="${iconClass}"></i>
            </div>
            <h3>${title}</h3>
            <div class="contact-info">${info}</div>
            <p>${description}</p>
        `;
        
        return card;
    }

    /**
     * Render websites based on current state
     * @param {String} searchQuery Optional search query
     */
    renderWebsites(searchQuery = '') {
        // Clear the container
        this.websitesContainer.innerHTML = '';
        
        // Get websites based on section
        let websites = this.getWebsitesByCurrentSection();
        
        // Apply search if query exists
        if (searchQuery) {
            websites = storageManager.searchWebsites(searchQuery);
        }
        
        // Apply filter if in the home page section
        if (this.currentSection === 'all') {
            websites = storageManager.filterWebsites(websites, this.currentFilter);
        }
        
        // Apply sort
        websites = storageManager.sortWebsites(websites, this.currentSort);
        
        // Show empty state if no websites
        if (websites.length === 0) {
            this.emptyState.style.display = 'flex';
            this.websitesContainer.appendChild(this.emptyState);
            return;
        }
        
        // Hide empty state
        this.emptyState.style.display = 'none';
        
        // Render each website
        websites.forEach(website => {
            const websiteCard = this.createWebsiteCard(website);
            this.websitesContainer.appendChild(websiteCard);
        });
    }

    /**
     * Create a website card element
     * @param {Object} website Website object
     * @returns {HTMLElement} Website card element
     */
    createWebsiteCard(website) {
        const card = document.createElement('div');
        card.className = 'website-card';
        card.dataset.id = website.id;
        
        // Create thumbnail
        const thumbnail = thumbnailManager.createThumbnail(website);
        
        // Create favorite button
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = `website-favorite ${website.isFavorite ? 'active' : ''}`;
        favoriteBtn.innerHTML = `<i class="fas ${website.isFavorite ? 'fa-star' : 'fa-star'}"></i>`;
        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleFavorite(website.id);
        });
        
        thumbnail.appendChild(favoriteBtn);
        card.appendChild(thumbnail);
        
        // Create info section
        const infoDiv = document.createElement('div');
        infoDiv.className = 'website-info';
        
        const title = document.createElement('h3');
        title.className = 'website-title';
        title.textContent = website.name;
        
        const url = document.createElement('p');
        url.className = 'website-url';
        url.textContent = website.url;
        
        // Create categories container
        const categories = document.createElement('div');
        categories.className = 'website-categories';
        
        // Add the category tag with proper styling
        const category = document.createElement('span');
        category.className = `website-category category-${website.category.toLowerCase()}`;
        category.textContent = website.category;
        
        const actions = document.createElement('div');
        actions.className = 'website-actions';
        
        const visitBtn = document.createElement('button');
        visitBtn.className = 'website-action-btn';
        visitBtn.innerHTML = '<i class="fas fa-external-link-alt"></i>';
        visitBtn.title = 'Visit Website';
        visitBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.open(website.url, '_blank');
        });
        
        const editBtn = document.createElement('button');
        editBtn.className = 'website-action-btn';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.title = 'Edit Website';
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openEditWebsiteModal(website.id);
        });
        
        actions.appendChild(visitBtn);
        actions.appendChild(editBtn);
        
        // Add category to categories container
        categories.appendChild(category);
        
        infoDiv.appendChild(title);
        infoDiv.appendChild(url);
        infoDiv.appendChild(categories);
        infoDiv.appendChild(actions);
        
        card.appendChild(infoDiv);
        
        // Open website when clicking on the card (except when clicking buttons)
        card.addEventListener('click', () => {
            window.open(website.url, '_blank');
        });
        
        return card;
    }

    /**
     * Toggle favorite status of a website
     * @param {String} id Website ID
     */
    toggleFavorite(id) {
        const updatedWebsite = storageManager.toggleFavorite(id);
        
        if (updatedWebsite) {
            // Update UI
            const card = document.querySelector(`.website-card[data-id="${id}"]`);
            if (card) {
                const favoriteBtn = card.querySelector('.website-favorite');
                
                if (updatedWebsite.isFavorite) {
                    favoriteBtn.classList.add('active');
                    this.showToast('Added to favorites', 'success');
                } else {
                    favoriteBtn.classList.remove('active');
                    this.showToast('Removed from favorites', 'info');
                }
            }
            
            // If in favorites section, we might need to re-render
            if (this.currentSection === 'favorites') {
                this.renderWebsites();
            }
        }
    }

    /**
     * Open the Add Website modal
     */
    openAddWebsiteModal() {
        this.addWebsiteForm.reset();
        this.addWebsiteModal.classList.add('show');
    }

    /**
     * Close the Add Website modal
     */
    closeAddWebsiteModal() {
        this.addWebsiteModal.classList.add('modal-closing');
        
        setTimeout(() => {
            this.addWebsiteModal.classList.remove('show');
            this.addWebsiteModal.classList.remove('modal-closing');
        }, 300);
    }

    /**
     * Handle the Add Website form submission
     * @param {Event} e Form submit event
     */
    handleAddWebsite(e) {
        e.preventDefault();
        
        const name = document.getElementById('websiteName').value;
        const url = document.getElementById('websiteUrl').value;
        const category = document.getElementById('websiteCategory').value;
        const isFavorite = document.getElementById('addToFavorites').checked;
        
        const newWebsite = storageManager.addWebsite({
            name,
            url,
            category,
            isFavorite
        });
        
        // Close modal
        this.closeAddWebsiteModal();
        
        // Show success toast
        this.showToast(`Added "${name}" successfully`, 'success');
        
        // Re-render websites
        this.renderWebsites();
    }

    /**
     * Open the Edit Website modal
     * @param {String} id Website ID
     */
    openEditWebsiteModal(id) {
        const website = storageManager.getWebsiteById(id);
        
        if (!website) {
            this.showToast('Website not found', 'error');
            return;
        }
        
        // Store current ID
        this.currentWebsiteId = id;
        
        // Set form values
        document.getElementById('editWebsiteId').value = id;
        document.getElementById('editWebsiteName').value = website.name;
        document.getElementById('editWebsiteUrl').value = website.url;
        document.getElementById('editWebsiteCategory').value = website.category;
        document.getElementById('editAddToFavorites').checked = website.isFavorite;
        
        // Show modal
        this.editWebsiteModal.classList.add('show');
    }

    /**
     * Close the Edit Website modal
     */
    closeEditWebsiteModal() {
        this.editWebsiteModal.classList.add('modal-closing');
        
        setTimeout(() => {
            this.editWebsiteModal.classList.remove('show');
            this.editWebsiteModal.classList.remove('modal-closing');
            this.currentWebsiteId = null;
        }, 300);
    }

    /**
     * Handle the Edit Website form submission
     * @param {Event} e Form submit event
     */
    handleEditWebsite(e) {
        e.preventDefault();
        
        const id = document.getElementById('editWebsiteId').value;
        const name = document.getElementById('editWebsiteName').value;
        const url = document.getElementById('editWebsiteUrl').value;
        const category = document.getElementById('editWebsiteCategory').value;
        const isFavorite = document.getElementById('editAddToFavorites').checked;
        
        const updatedWebsite = storageManager.updateWebsite(id, {
            name,
            url,
            category,
            isFavorite
        });
        
        if (updatedWebsite) {
            // Close modal
            this.closeEditWebsiteModal();
            
            // Show success toast
            this.showToast(`Updated "${name}" successfully`, 'success');
            
            // Re-render websites
            this.renderWebsites();
        } else {
            this.showToast('Error updating website', 'error');
        }
    }

    /**
     * Open the Confirm Delete modal
     */
    openConfirmDeleteModal() {
        this.confirmDeleteModal.classList.add('show');
    }

    /**
     * Close the Confirm Delete modal
     */
    closeConfirmDeleteModal() {
        this.confirmDeleteModal.classList.add('modal-closing');
        
        setTimeout(() => {
            this.confirmDeleteModal.classList.remove('show');
            this.confirmDeleteModal.classList.remove('modal-closing');
        }, 300);
    }

    /**
     * Handle website deletion
     */
    handleDeleteWebsite() {
        const id = this.currentWebsiteId;
        
        if (!id) {
            this.showToast('No website selected for deletion', 'error');
            this.closeConfirmDeleteModal();
            return;
        }
        
        // Get website info before deletion for toast message
        const website = storageManager.getWebsiteById(id);
        const name = website ? website.name : 'Website';
        
        // Delete website
        const success = storageManager.deleteWebsite(id);
        
        if (success) {
            // Add deleting animation to card
            const card = document.querySelector(`.website-card[data-id="${id}"]`);
            if (card) {
                card.classList.add('deleting');
                
                setTimeout(() => {
                    // Re-render after animation
                    this.renderWebsites();
                }, 500);
            } else {
                this.renderWebsites();
            }
            
            // Show success toast
            this.showToast(`Deleted "${name}" successfully`, 'success');
            
            // Close modals
            this.closeConfirmDeleteModal();
            this.closeEditWebsiteModal();
        } else {
            this.showToast('Error deleting website', 'error');
            this.closeConfirmDeleteModal();
        }
    }

    /**
     * Show a toast notification
     * @param {String} message Toast message
     * @param {String} type Toast type ('success', 'error', 'info', 'warning')
     * @param {Number} duration Duration in ms (default: 3000)
     */
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let icon = '';
        switch (type) {
            case 'success':
                icon = '<i class="fas fa-check-circle"></i>';
                break;
            case 'error':
                icon = '<i class="fas fa-exclamation-circle"></i>';
                break;
            case 'warning':
                icon = '<i class="fas fa-exclamation-triangle"></i>';
                break;
            default: // info
                icon = '<i class="fas fa-info-circle"></i>';
        }
        
        toast.innerHTML = `
            ${icon}
            <span>${message}</span>
            <button class="toast-close"><i class="fas fa-times"></i></button>
        `;
        
        // Add close button event
        toast.querySelector('.toast-close').addEventListener('click', () => {
            this.dismissToast(toast);
        });
        
        // Add to container
        this.toastContainer.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Auto dismiss
        toast.timeoutId = setTimeout(() => {
            this.dismissToast(toast);
        }, duration);
    }

    /**
     * Dismiss a toast notification
     * @param {HTMLElement} toast Toast element
     */
    dismissToast(toast) {
        clearTimeout(toast.timeoutId);
        toast.classList.add('hiding');
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 500);
    }
    
    /**
     * Create starry background
     */
    createStars() {
        // Clear existing stars first
        this.starField.innerHTML = '';
        
        // Add shooting stars
        const shootingStar1 = document.createElement('div');
        shootingStar1.className = 'shooting-star';
        shootingStar1.style.top = `${Math.random() * 30}%`;
        shootingStar1.style.left = `${Math.random() * 100}%`;
        shootingStar1.style.animationDelay = `${Math.random() * 5}s`;
        this.starField.appendChild(shootingStar1);
        
        const shootingStar2 = document.createElement('div');
        shootingStar2.className = 'shooting-star';
        shootingStar2.style.top = `${Math.random() * 30 + 40}%`;
        shootingStar2.style.left = `${Math.random() * 100}%`;
        shootingStar2.style.animationDelay = `${Math.random() * 5 + 5}s`;
        this.starField.appendChild(shootingStar2);
        
        // Create random stars
        const starCount = 80; // Total number of stars
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            // Random position
            star.style.top = `${Math.random() * 100}%`;
            star.style.left = `${Math.random() * 100}%`;
            
            // Random size between 1-3px
            const size = Math.random() * 2 + 1;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            
            // Random animation duration between 3-7s
            star.style.setProperty('--duration', `${Math.random() * 4 + 3}s`);
            
            // Random animation delay
            star.style.animationDelay = `${Math.random() * 5}s`;
            
            // Assign different colors
            const colorType = Math.floor(Math.random() * 4);
            if (colorType === 0) {
                star.classList.add('star-purple');
            } else if (colorType === 1) {
                star.classList.add('star-teal');
            } else if (colorType === 2) {
                star.classList.add('star-orange');
            }
            
            this.starField.appendChild(star);
        }
    }
}

// Create a global instance of the UIManager
const uiManager = new UIManager();
