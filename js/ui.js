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
        // View options removed as per user request
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
        this.currentSection = 'all'; // all, favorites, recent, etc.
        this.currentFilter = 'all'; // all, work, personal, etc.
        this.currentSort = 'date-new'; // name-asc, name-desc, date-new, date-old
        this.currentWebsiteId = null; // For editing

        // Init
        this.initEventListeners();
        this.createStars();
        this.updateCategoryCounts(); // Initialize counter on page load
    }

    /**
     * Initialize all event listeners
     */
    initEventListeners() {
        // View toggle removed as per user request

        // Logo toggle for sidebar
        document.getElementById('sidebarToggle').addEventListener('click', () => this.toggleSidebar());

        // Search input
        this.searchInput.addEventListener('input', () => this.handleSearch());

        // Navigation
        this.navItems.forEach(item => {
            item.addEventListener('click', () => {
                const section = item.dataset.section;
                this.changeSection(section);
            });
        });
        
        // Contact button in sidebar
        document.querySelector('.contact-btn-sidebar').addEventListener('click', (e) => {
            e.preventDefault();
            this.changeSection('contact');
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
     * Change the current view (grid only as per user request)
     * @param {String} view View type (only 'grid' supported now)
     */
    changeView(view) {
        // Always use grid view as per user request
        this.websitesContainer.classList.remove('list-view');
        this.websitesContainer.classList.add('grid-view');

        this.renderWebsites(); // Re-render to adjust layouts
    }

    /**
     * Toggle sidebar expanded/collapsed state
     */
    toggleSidebar() {
        this.sidebar.classList.toggle('sidebar-collapsed');

        // Toggle active class on the logo for visual feedback
        const logo = document.getElementById('sidebarToggle');
        if (logo) {
            logo.classList.toggle('active');
        }

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

        // Hide/show search bar and filter options depending on section
        const searchContainer = document.querySelector('.search-container');
        const viewFilterContainer = document.querySelector('.view-filter-container');
        const welcomeSection = document.querySelector('.welcome-section');
        const viewToggleBtns = document.querySelectorAll('.view-toggle button');
        const websitesContainer = document.querySelector('.websites-container');

        if (section === 'contact') {
            // Hide search bar, welcome section and filter options on contact page
            if (searchContainer) searchContainer.style.display = 'none';
            if (viewFilterContainer) viewFilterContainer.style.display = 'none';
            if (welcomeSection) welcomeSection.style.display = 'none';

            // Force list view for contact page by disabling grid view
            if (websitesContainer) {
                websitesContainer.classList.remove('grid-view');
                websitesContainer.classList.add('list-view');
            }

            // Disable view toggle buttons for contact page
            if (viewToggleBtns) {
                viewToggleBtns.forEach(btn => {
                    btn.disabled = true;
                    btn.style.opacity = '0.5';
                    btn.style.cursor = 'not-allowed';
                });
            }

            // Render contact page
            this.currentSection = section;
            this.renderContactPage();
            return; // Exit early to prevent renderWebsites call at the end
        } else {
            // Show elements on other pages
            if (searchContainer) searchContainer.style.display = 'flex';
            if (viewFilterContainer) viewFilterContainer.style.display = 'flex';
            if (welcomeSection) welcomeSection.style.display = 'block';

            // Re-enable view toggle buttons
            if (viewToggleBtns) {
                viewToggleBtns.forEach(btn => {
                    btn.disabled = false;
                    btn.style.opacity = '1';
                    btn.style.cursor = 'pointer';
                });
            }

            // Apply current view setting
            if (websitesContainer) {
                if (this.currentView === 'grid') {
                    websitesContainer.classList.add('grid-view');
                    websitesContainer.classList.remove('list-view');
                } else {
                    websitesContainer.classList.remove('grid-view');
                    websitesContainer.classList.add('list-view');
                }
            }
        }

        this.currentSection = section;
        this.renderWebsites();
        this.updateCategoryCounts();
    }

    /**
     * Handle search input
     */
    handleSearch() {
        const query = this.searchInput.value;
        this.renderWebsites(query);
        this.updateCategoryCounts();
    }

    /**
     * Apply filter to websites
     * @param {String} filter Filter name
     */
    applyFilter(filter) {
        this.currentFilter = filter;
        this.renderWebsites();
        this.updateCategoryCounts();
    }

    /**
     * Apply sort to websites
     * @param {String} sort Sort name
     */
    applySort(sort) {
        this.currentSort = sort;
        this.renderWebsites();
        this.updateCategoryCounts();
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
            case 'web':
                return storageManager.getWebsitesByCategory('web');
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

        // Create hero section with animated background
        const heroSection = document.createElement('div');
        heroSection.className = 'contact-hero';

        // Create animated background
        const animatedBg = document.createElement('div');
        animatedBg.className = 'contact-animated-bg';
        for (let i = 0; i < 5; i++) {
            const circle = document.createElement('div');
            circle.className = 'animated-circle';
            circle.style.animationDelay = `${i * 0.5}s`;
            animatedBg.appendChild(circle);
        }

        // Create hero content
        const heroContent = document.createElement('div');
        heroContent.className = 'contact-hero-content';

        const header = document.createElement('h1');
        header.textContent = 'Get In Touch';
        header.className = 'contact-hero-title';

        const subtitle = document.createElement('span');
        subtitle.textContent = 'We\'d love to hear from you';
        subtitle.className = 'contact-hero-subtitle';

        const description = document.createElement('p');
        description.textContent = 'Have questions or suggestions about CloudVault? Our team is just a click away. Connect with us through any of these channels.';
        description.className = 'contact-hero-description';

        // Create social links tabs
        const socialTabs = document.createElement('div');
        socialTabs.className = 'social-tabs';

        // Add social media links with labels
        const socialPlatforms = [
            { icon: 'fab fa-github', name: 'GitHub', url: 'https://github.com' },
            { icon: 'fab fa-twitter', name: 'Twitter', url: 'https://twitter.com' },
            { icon: 'fab fa-discord', name: 'Discord', url: 'https://discord.com' },
            { icon: 'fab fa-instagram', name: 'Instagram', url: 'https://instagram.com' },
            { icon: 'fab fa-linkedin', name: 'LinkedIn', url: 'https://linkedin.com' },
            { icon: 'fab fa-youtube', name: 'YouTube', url: 'https://youtube.com' },
            { icon: 'fab fa-reddit', name: 'Reddit', url: 'https://reddit.com' }
        ];

        socialPlatforms.forEach(platform => {
            const tab = document.createElement('a');
            tab.className = 'social-tab';
            tab.href = platform.url;
            tab.target = '_blank';
            tab.innerHTML = `
                <div class="social-tab-icon">
                    <i class="${platform.icon}"></i>
                </div>
                <span class="social-tab-name">${platform.name}</span>
            `;
            socialTabs.appendChild(tab);
        });

        // Append hero content elements
        heroContent.appendChild(header);
        heroContent.appendChild(subtitle);
        heroContent.appendChild(description);
        heroContent.appendChild(socialTabs);

        // Append hero elements
        heroSection.appendChild(animatedBg);
        heroSection.appendChild(heroContent);

        // Create contact methods section
        const contactMethods = document.createElement('div');
        contactMethods.className = 'contact-methods';

        // Create section title
        const methodsTitle = document.createElement('h2');
        methodsTitle.textContent = 'Ways to Connect';
        methodsTitle.className = 'contact-methods-title';

        // Create contact cards grid
        const contactCards = document.createElement('div');
        contactCards.className = 'contact-cards';

        // Create contact cards with hover effects and thumbnails
        const contactOptions = [
            {
                icon: 'fas fa-envelope',
                title: 'Email Us',
                info: 'support@linkvault.com',
                description: 'Send us an email anytime. Our support team responds within 24 hours.',
                color: 'primary',
                thumbnail: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400'
            },
            {
                icon: 'fas fa-comment-dots',
                title: 'Live Chat',
                info: 'Available 9am-5pm ET',
                description: 'Get instant answers to your questions through our live chat support.',
                color: 'secondary',
                thumbnail: 'https://images.unsplash.com/photo-1611746869696-d09bce200020?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400'
            },
            {
                icon: 'fas fa-map-marker-alt',
                title: 'Visit Us',
                info: 'Tech Plaza, Suite 404',
                description: 'Schedule an in-person meeting at our headquarters in Silicon Valley.',
                color: 'info',
                thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400'
            }
        ];

        contactOptions.forEach(option => {
            const card = document.createElement('div');
            card.className = `contact-card contact-card-${option.color}`;

            // Create thumbnail background
            const thumbnail = document.createElement('div');
            thumbnail.className = 'contact-card-thumbnail';
            thumbnail.style.backgroundImage = `url(${option.thumbnail})`;

            // Create gradient overlay that matches the card color
            const overlay = document.createElement('div');
            overlay.className = `contact-card-overlay contact-card-overlay-${option.color}`;

            card.appendChild(thumbnail);
            card.appendChild(overlay);

            // Create content
            const content = document.createElement('div');
            content.className = 'contact-card-content';
            content.innerHTML = `
                <div class="contact-card-icon">
                    <i class="${option.icon}"></i>
                </div>
                <h3>${option.title}</h3>
                <div class="contact-info">${option.info}</div>
                <p>${option.description}</p>
            `;

            // Add shine effect
            const shine = document.createElement('div');
            shine.className = 'contact-card-shine';

            card.appendChild(content);
            card.appendChild(shine);

            contactCards.appendChild(card);
        });

        // Create feedback form section
        const feedbackSection = document.createElement('div');
        feedbackSection.className = 'contact-feedback';

        const feedbackTitle = document.createElement('h2');
        feedbackTitle.textContent = 'Leave Feedback';
        feedbackTitle.className = 'feedback-title';

        const feedbackMsg = document.createElement('p');
        feedbackMsg.textContent = 'We value your input. Share your thoughts about CloudVault and help us improve your experience.';
        feedbackMsg.className = 'feedback-description';

        const feedbackBtn = document.createElement('button');
        feedbackBtn.className = 'feedback-button';
        feedbackBtn.textContent = 'Send Feedback';
        feedbackBtn.innerHTML = `
            <span>Send Feedback</span>
            <i class="fas fa-paper-plane"></i>
        `;

        feedbackSection.appendChild(feedbackTitle);
        feedbackSection.appendChild(feedbackMsg);
        feedbackSection.appendChild(feedbackBtn);

        // Append methods section elements
        contactMethods.appendChild(methodsTitle);
        contactMethods.appendChild(contactCards);

        // Append all sections to contact container
        contactContainer.appendChild(heroSection);
        contactContainer.appendChild(contactMethods);
        contactContainer.appendChild(feedbackSection);

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

        // If we're on the contact page, render the contact page instead and exit
        if (this.currentSection === 'contact') {
            this.renderContactPage();
            return;
        }

        // Always ensure grid view
        this.websitesContainer.classList.remove('list-view');
        this.websitesContainer.classList.add('grid-view');

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
        
        // Update category counters
        this.updateCategoryCounts();

        // Apply sort
        websites = storageManager.sortWebsites(websites, this.currentSort);

        // Show empty state if no websites (but not on contact page)
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

        // Add cyberpunk elements
        const cardGlow = document.createElement('div');
        cardGlow.className = 'card-glow';
        
        // Add circuit lines
        const circuitLines = document.createElement('div');
        circuitLines.className = 'circuit-lines';
        
        // Add corner decorations
        const corners = [];
        ['top-left', 'top-right', 'bottom-left', 'bottom-right'].forEach(position => {
            const corner = document.createElement('div');
            corner.className = `corner ${position}`;
            corners.push(corner);
            card.appendChild(corner);
        });
        
        // Add glow lines
        const glowLines = [];
        ['top', 'right', 'bottom', 'left'].forEach(position => {
            const glowLine = document.createElement('div');
            glowLine.className = `glow-line glow-line-${position}`;
            glowLines.push(glowLine);
            card.appendChild(glowLine);
        });
        
        // Add holographic effect
        const holoEffect = document.createElement('div');
        holoEffect.className = 'holo-effect';
        
        // Create thumbnail with enhanced styling
        const thumbnail = thumbnailManager.createThumbnail(website);
        thumbnail.classList.add('enhanced-thumbnail');
        
        // Add scan line effect over thumbnail
        const scanLines = document.createElement('div');
        scanLines.className = 'scan-lines';
        thumbnail.appendChild(scanLines);
        
        card.appendChild(thumbnail);
        
        // Add ripple effect container
        const rippleContainer = document.createElement('div');
        rippleContainer.className = 'ripple-container';
        card.appendChild(rippleContainer);

        // Create info section with enhanced styling
        const infoDiv = document.createElement('div');
        infoDiv.className = 'website-info';

        // Add glitch effect to title
        const titleContainer = document.createElement('div');
        titleContainer.className = 'title-container';
        
        const title = document.createElement('h3');
        title.className = 'website-title';
        title.textContent = website.name;
        title.setAttribute('data-text', website.name); // For glitch effect
        
        titleContainer.appendChild(title);
        
        const description = document.createElement('p');
        description.className = 'website-description';
        description.textContent = website.description || 'No description available';

        const url = document.createElement('p');
        url.className = 'website-url';
        url.textContent = website.url;
        
        // Add URL icon
        const urlIcon = document.createElement('i');
        urlIcon.className = 'fas fa-link url-icon';
        url.prepend(urlIcon);

        // Create categories container with enhanced styling
        const categories = document.createElement('div');
        categories.className = 'website-categories';

        // Add category tag with icon based on category
        const category = document.createElement('span');
        category.className = `website-category category-${website.category.toLowerCase()}`;
        
        // Add category icon
        const categoryIcon = document.createElement('i');
        
        // Select icon based on category
        let iconClass = 'fa-tag';
        if (website.category.toLowerCase() === 'work') {
            iconClass = 'fa-briefcase';
        } else if (website.category.toLowerCase() === 'personal') {
            iconClass = 'fa-user';
        } else if (website.category.toLowerCase() === 'social') {
            iconClass = 'fa-users';
        } else if (website.category.toLowerCase() === 'entertainment') {
            iconClass = 'fa-gamepad';
        } else if (website.category.toLowerCase() === 'web') {
            iconClass = 'fa-globe';
        } else if (website.category.toLowerCase() === 'others') {
            iconClass = 'fa-star';
        }
        
        categoryIcon.className = `fas ${iconClass} category-icon`;
        category.appendChild(categoryIcon);
        
        const categoryText = document.createElement('span');
        categoryText.className = 'category-text';
        categoryText.textContent = website.category;
        category.appendChild(categoryText);

        // Build card structure with enhanced elements
        categories.appendChild(category);
        infoDiv.appendChild(titleContainer);
        infoDiv.appendChild(description);
        infoDiv.appendChild(url);
        infoDiv.appendChild(categories);
        
        // Edit functionality removed as per user request
        
        // Add card elements
        card.appendChild(circuitLines);
        card.appendChild(cardGlow);
        card.appendChild(holoEffect);
        card.appendChild(infoDiv);

        // Enhanced mouse movement effects
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / card.offsetWidth) * 100;
            const y = ((e.clientY - rect.top) / card.offsetHeight) * 100;
            
            // Set CSS variables for spotlight effect
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
            
            // 3D rotation effect
            const rotateY = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
            const rotateX = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
            
            // Apply transform with enhanced perspective effect
            card.style.transform = `
                translateY(-15px)
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                scale3d(1.05, 1.05, 1.05)
            `;
            
            // Animate holo-effect based on mouse position
            holoEffect.style.opacity = '1';
            holoEffect.style.background = `
                radial-gradient(
                    circle at ${x}% ${y}%, 
                    rgba(157, 78, 221, 0.2) 0%, 
                    transparent 50%
                )
            `;
            
            // Move corner elements slightly for extra depth
            corners.forEach(corner => {
                const cornerX = corner.classList.contains('right') ? -1 : 1;
                const cornerY = corner.classList.contains('bottom') ? -1 : 1;
                corner.style.transform = `translate(${cornerX * rotateY * 0.5}px, ${cornerY * rotateX * 0.5}px)`;
            });
            
            // Create ripple effect on mouse move
            if (Math.random() > 0.92) { // Occasionally create ripples
                const ripple = document.createElement('div');
                ripple.className = 'ripple';
                ripple.style.left = `${x}%`;
                ripple.style.top = `${y}%`;
                rippleContainer.appendChild(ripple);
                
                // Remove ripple after animation completes
                setTimeout(() => {
                    ripple.remove();
                }, 1000);
            }
        });

        // Reset styles on mouse leave
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            holoEffect.style.opacity = '0';
            
            // Reset corner elements
            corners.forEach(corner => {
                corner.style.transform = '';
            });
        });

        // Card click handler - now handled by Visit button
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
        const thumbnailUrl = document.getElementById('websiteThumbnailUrl')?.value || '';

        const newWebsite = storageManager.addWebsite({
            name,
            url,
            category,
            thumbnailUrl: thumbnailUrl.trim() || null
        });

        // Close modal
        this.closeAddWebsiteModal();

        // Show success toast
        this.showToast(`Added "${name}" successfully`, 'success');

        // Re-render websites
        this.renderWebsites();
        
        // Update counter
        this.updateCategoryCounts();
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

        // Set thumbnail URL if available
        const thumbnailUrlField = document.getElementById('editWebsiteThumbnailUrl');
        if (thumbnailUrlField) {
            thumbnailUrlField.value = website.thumbnailUrl || '';
        }

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
        const thumbnailUrl = document.getElementById('editWebsiteThumbnailUrl')?.value || '';

        const updatedWebsite = storageManager.updateWebsite(id, {
            name,
            url,
            category,
            thumbnailUrl: thumbnailUrl.trim() || null
        });

        if (updatedWebsite) {
            // Close modal
            this.closeEditWebsiteModal();

            // Show success toast
            this.showToast(`Updated "${name}" successfully`, 'success');

            // Re-render websites
            this.renderWebsites();
            
            // Update counter
            this.updateCategoryCounts();
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
                    this.updateCategoryCounts();
                }, 500);
            } else {
                this.renderWebsites();
                this.updateCategoryCounts();
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
     * Update category counter based on the current filter
     */
    updateCategoryCounts() {
        const currentCountElement = document.getElementById('current-count');
        let count = 0;
        let countText = '';
        
        if (this.currentSection === 'all') {
            if (this.currentFilter === 'all') {
                // Display total website count
                count = storageManager.getAllWebsites().length;
                countText = `${count}`;
            } else {
                // Display count for the selected category
                count = storageManager.getWebsitesByCategory(this.currentFilter).length;
                countText = `${count}`;
            }
        } else if (this.currentSection === 'recent') {
            count = storageManager.getRecentWebsites().length;
            countText = `${count}`;
        } else if (this.currentSection === 'favorites') {
            count = storageManager.getFavoriteWebsites().length;
            countText = `${count}`;
        } else {
            count = storageManager.getWebsitesByCategory(this.currentSection).length;
            countText = `${count}`;
        }
        
        // Get the element and update the count with a nice animation
        const oldCount = parseInt(currentCountElement.textContent) || 0;
        
        // If the count has changed, add animation
        if (oldCount !== count) {
            currentCountElement.classList.add('count-updating');
            setTimeout(() => {
                currentCountElement.textContent = countText;
                currentCountElement.classList.remove('count-updating');
            }, 300);
        } else {
            currentCountElement.textContent = countText;
        }
    }

    /**
     * Create static starry background (removed animations)
     */
    createStars() {
        // Clear existing stars first
        this.starField.innerHTML = '';

        // Create an enhanced starfield with various types of stars
        const staticStarCount = 220; // Increased background static stars
        const floatingStarCount = 90; // Increased stars with floating animation
        const shootingStarCount = 15; // Increased shooting stars that move across the screen

        // 1. Create Static Stars (with subtle pulse animation)
        for (let i = 0; i < staticStarCount; i++) {
            const star = document.createElement('div');
            star.className = 'star static';

            // Random position
            star.style.top = `${Math.random() * 100}%`;
            star.style.left = `${Math.random() * 100}%`;

            // Random size between 1-4px (slightly larger)
            const size = Math.random() * 3 + 1;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;

            // Random opacity for depth effect
            star.style.opacity = Math.random() * 0.6 + 0.4; // Slightly brighter

            // Assign different colors with more variety
            const colorType = Math.floor(Math.random() * 7); // More color options
            if (colorType === 0 || colorType === 5) {
                star.classList.add('star-purple');
            } else if (colorType === 1) {
                star.classList.add('star-teal');
            } else if (colorType === 2) {
                star.classList.add('star-orange');
            } else if (colorType === 3 || colorType === 6) {
                star.classList.add('star-blue');
            } else {
                star.classList.add('star-pink');
            }

            this.starField.appendChild(star);
        }

        // 2. Create Floating Stars (with twinkle and float animations)
        for (let i = 0; i < floatingStarCount; i++) {
            const star = document.createElement('div');
            star.className = 'star floating';

            // Random position
            star.style.top = `${Math.random() * 100}%`;
            star.style.left = `${Math.random() * 100}%`;

            // Random size between 2-6px for more visible floating stars
            const size = Math.random() * 4 + 2;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;

            // Random animation durations for more natural movement
            star.style.setProperty('--twinkle-duration', `${Math.random() * 4 + 1.5}s`); // Faster twinkling
            star.style.setProperty('--float-duration', `${Math.random() * 18 + 8}s`); // Diverse float times

            // Assign different colors - make these more likely to be colorful
            const colorType = Math.floor(Math.random() * 7);
            if (colorType <= 1 || colorType === 6) {
                star.classList.add('star-purple');
            } else if (colorType === 2) {
                star.classList.add('star-teal');
            } else if (colorType === 3) {
                star.classList.add('star-blue');
            } else if (colorType === 5) {
                star.classList.add('star-orange');
            } else {
                star.classList.add('star-pink');
            }

            this.starField.appendChild(star);
        }

        // 3. Create Shooting Stars (animated across the screen)
        const createShootingStar = () => {
            const star = document.createElement('div');
            star.className = 'star shooting';

            // Random starting position (more variety in starting points)
            const topPosition = Math.random() * 80;
            const startSide = Math.random() > 0.3; // 70% from left, 30% from right
            
            if (startSide) {
                // From left side
                star.style.top = `${topPosition}%`;
                star.style.left = '-5%'; // Start slightly off-screen
                star.style.transform = `rotate(${Math.random() * 35 + 15}deg)`; // 15-50 degree angle
            } else {
                // From right side
                star.style.top = `${topPosition}%`;
                star.style.left = '105%'; // Start slightly off-screen
                star.style.transform = `rotate(${Math.random() * 35 + 150}deg)`; // 150-185 degree angle
            }
            
            // Random animation duration for varied speeds
            star.style.setProperty('--shooting-duration', `${Math.random() * 1.5 + 0.8}s`);
            
            // Random color for shooting stars too
            const colorType = Math.floor(Math.random() * 5);
            if (colorType === 0) {
                star.classList.add('star-purple');
            } else if (colorType === 1) {
                star.classList.add('star-blue');
            } else if (colorType === 2) {
                star.classList.add('star-pink');
            }

            this.starField.appendChild(star);
            
            // Remove the shooting star after animation completes
            setTimeout(() => {
                if (star.parentNode === this.starField) {
                    this.starField.removeChild(star);
                }
            }, 3000);
        };

        // Initial shooting stars
        for (let i = 0; i < shootingStarCount; i++) {
            setTimeout(() => createShootingStar(), Math.random() * 3000); // Create them faster initially
        }

        // Continue creating shooting stars periodically
        setInterval(() => {
            if (Math.random() > 0.5) { // 50% chance to create a new shooting star (increased frequency)
                createShootingStar();
            }
        }, 2000); // Faster interval between shooting stars
    }
}

// Create a global instance of the UIManager
const uiManager = new UIManager();
