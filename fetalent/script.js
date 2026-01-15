// TalentConnect Pro - Enhanced Main JavaScript Application
const TalentConnectPro = {
    // Initialize application
    init: function() {
        console.log('TalentConnectPro Initializing...');
        this.initializeComponents();
        this.setupEventListeners();
        this.loadInitialData();
        this.updateUI();
        this.startAnimations();
        console.log('TalentConnectPro Initialized Successfully!');
    },

    // Application State
    state: {
        currentUser: null,
        conferences: [],
        pendingConferences: [],
        theme: 'light',
        notifications: [],
        mobileMenuOpen: false,
        modals: {
            signIn: false,
            participantSignUp: false,
            hostSignUp: false,
            profile: false,
            createEvent: false,
            adminPanel: false
        }
    },

    // Default Data
    defaultData: {
        users: [
            {
                id: 1,
                email: "demo@example.com",
                password: "demo123",
                firstName: "John",
                lastName: "Doe",
                role: "participant",
                age: 21,
                institution: "University of Technology",
                educationLevel: "undergraduate",
                disabilityType: "mobility",
                eventsAttended: 12,
                connections: 47
            },
            {
                id: 2,
                email: "w2227021@gmail.com",
                password: "11111111",
                firstName: "Admin",
                lastName: "User",
                role: "admin",
                institution: "TalentConnect Pro",
                eventsApproved: 0,
                eventsDeclined: 0
            }
        ],
        approvedConferences: [
            {
                id: 1,
                title: "Tech Innovation Summit 2024",
                description: "Join leading tech innovators discussing the future of accessible technology.",
                host: "Tech Accessibility Council",
                hostId: 100,
                date: "2024-04-15",
                time: "14:00",
                duration: 120,
                link: "https://zoom.us/j/example1",
                accessibility: ["captioning", "screen-reader", "keyboard-nav"],
                maxParticipants: 200,
                registeredParticipants: 156,
                category: "tech",
                tags: ["tech", "innovation", "accessibility"],
                status: "upcoming",
                approved: true
            },
            {
                id: 2,
                title: "Creative Arts Showcase",
                description: "Showcase your artistic talents to galleries and creative agencies.",
                host: "Arts for All Foundation",
                hostId: 101,
                date: "2024-04-20",
                time: "18:30",
                duration: 90,
                link: "https://meet.google.com/example2",
                accessibility: ["sign-language", "audio-description", "high-contrast"],
                maxParticipants: 150,
                registeredParticipants: 150,
                category: "creative",
                tags: ["arts", "creative", "showcase"],
                status: "live",
                approved: true
            }
        ]
    },

    // DOM Elements
    elements: {
        loadingScreen: null,
        customCursor: null,
        cursorOutline: null,
        themeToggle: null,
        mobileMenuBtn: null,
        mainNav: null,
        mainHeader: null,
        exploreBtn: null,
        authButtonsContainer: null,
        conferenceGrid: null,
        countdownTimer: null,
        modalOverlay: null,
        modals: {},
        toastContainer: null
    },

    // Initialize DOM Elements
    initializeComponents: function() {
        console.log('Initializing components...');
        
        // Cache DOM elements
        this.elements.loadingScreen = document.getElementById('loadingScreen');
        this.elements.customCursor = document.querySelector('.custom-cursor');
        this.elements.cursorOutline = document.querySelector('.cursor-outline');
        this.elements.themeToggle = document.getElementById('themeToggle');
        this.elements.mobileMenuBtn = document.getElementById('mobileMenuBtn');
        this.elements.mainNav = document.querySelector('.main-nav');
        this.elements.mainHeader = document.getElementById('mainHeader');
        this.elements.exploreBtn = document.getElementById('exploreBtn');
        this.elements.howItWorksBtn = document.getElementById('howItWorksBtn');
        this.elements.authButtonsContainer = document.getElementById('authButtonsContainer');
        this.elements.conferenceGrid = document.getElementById('conferenceGrid');
        this.elements.countdownTimer = document.getElementById('countdownTimer');
        this.elements.modalOverlay = document.getElementById('modalOverlay');
        this.elements.toastContainer = document.getElementById('toastContainer');

        // Cache modals
        this.elements.modals.signIn = document.getElementById('signInModal');
        this.elements.modals.participantSignUp = document.getElementById('participantSignUpModal');
        this.elements.modals.hostSignUp = document.getElementById('hostSignUpModal');
        this.elements.modals.profile = document.getElementById('profileModal');
        this.elements.modals.createEvent = document.getElementById('createEventModal');
        this.elements.modals.adminPanel = document.getElementById('adminPanelModal');
        this.elements.modals.conferenceDetails = document.getElementById('conferenceDetailsModal');
        this.elements.modals.confirmation = document.getElementById('confirmationModal');

        // Set current year in footer
        document.getElementById('currentYear').textContent = new Date().getFullYear();
        
        console.log('Components initialized:', this.elements);
    },

    // Setup Event Listeners
    setupEventListeners: function() {
        console.log('Setting up event listeners...');
        
        // Theme Toggle
        if (this.elements.themeToggle) {
            this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Mobile Menu
        if (this.elements.mobileMenuBtn) {
            this.elements.mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Explore Conferences Button
        if (this.elements.exploreBtn) {
            this.elements.exploreBtn.addEventListener('click', () => {
                document.getElementById('conferences').scrollIntoView({ behavior: 'smooth' });
            });
        }

        // How It Works Button
        if (this.elements.howItWorksBtn) {
            this.elements.howItWorksBtn.addEventListener('click', () => {
                document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' });
            });
        }

        // Start Journey Button
        const startJourneyBtn = document.getElementById('startJourneyBtn');
        if (startJourneyBtn) {
            startJourneyBtn.addEventListener('click', () => this.handleStartJourney());
        }

        // Modal Close Buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => this.closeAllModals());
        });

        // Modal Overlay
        if (this.elements.modalOverlay) {
            this.elements.modalOverlay.addEventListener('click', () => this.closeAllModals());
        }

        // Close modals on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeAllModals();
        });

        // Sign In Form
        const signInForm = document.getElementById('signInForm');
        if (signInForm) {
            signInForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignIn();
            });
        }

        // Role Selector in Sign In
        document.querySelectorAll('#signInModal .role-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const parent = e.target.closest('.role-selector');
                parent.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Switch to Participant Sign Up
        const switchToParticipantSignUp = document.getElementById('switchToParticipantSignUp');
        if (switchToParticipantSignUp) {
            switchToParticipantSignUp.addEventListener('click', () => {
                this.closeAllModals();
                this.openModal('participantSignUp');
            });
        }

        // Switch to Host Sign Up
        const switchToHostSignUp = document.getElementById('switchToHostSignUp');
        if (switchToHostSignUp) {
            switchToHostSignUp.addEventListener('click', () => {
                this.closeAllModals();
                this.openModal('hostSignUp');
            });
        }

        // Participant Sign Up Form
        const participantSignUpForm = document.getElementById('participantSignUpForm');
        if (participantSignUpForm) {
            participantSignUpForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleParticipantSignUp();
            });

            // Disability Type Select
            const disabilityType = document.getElementById('participantDisabilityType');
            if (disabilityType) {
                disabilityType.addEventListener('change', (e) => {
                    const otherField = document.getElementById('participantOtherDisabilityField');
                    otherField.style.display = e.target.value === 'other' ? 'block' : 'none';
                });
            }

            // Password Strength
            const passwordInput = document.getElementById('participantPassword');
            if (passwordInput) {
                passwordInput.addEventListener('input', (e) => {
                    this.updatePasswordStrength(e.target.value, 'participant');
                });
            }
        }

        // Host Sign Up Form
        const hostSignUpForm = document.getElementById('hostSignUpForm');
        if (hostSignUpForm) {
            hostSignUpForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleHostSignUp();
            });

            // Password Strength
            const passwordInput = document.getElementById('hostPassword');
            if (passwordInput) {
                passwordInput.addEventListener('input', (e) => {
                    this.updatePasswordStrength(e.target.value, 'host');
                });
            }
        }

        // Create Event Form
        const createEventForm = document.getElementById('createEventForm');
        if (createEventForm) {
            createEventForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.showEventConfirmation();
            });

            // Participants Range
            const participantsRange = document.getElementById('maxParticipants');
            if (participantsRange) {
                participantsRange.addEventListener('input', (e) => {
                    const valueDisplay = document.getElementById('participantsValue');
                    if (valueDisplay) {
                        valueDisplay.textContent = e.target.value;
                    }
                });
            }

            // Cancel Event Button
            const cancelEventBtn = document.getElementById('cancelEventBtn');
            if (cancelEventBtn) {
                cancelEventBtn.addEventListener('click', () => {
                    this.closeAllModals();
                });
            }
        }

        // Confirmation Modal Buttons
        const confirmCancelBtn = document.getElementById('confirmCancelBtn');
        if (confirmCancelBtn) {
            confirmCancelBtn.addEventListener('click', () => {
                this.closeAllModals();
            });
        }

        const confirmProceedBtn = document.getElementById('confirmProceedBtn');
        if (confirmProceedBtn) {
            confirmProceedBtn.addEventListener('click', () => {
                this.handleCreateEvent();
            });
        }

        // Filter Buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.filterConferences(filter);
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Story Read More Buttons
        document.querySelectorAll('.story-read-more').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.showNotification('Coming Soon!', 'Full success stories will be available soon.', 'info');
            });
        });

        // Custom Cursor
        document.addEventListener('mousemove', (e) => this.updateCursor(e));

        // Header Scroll Effect
        window.addEventListener('scroll', () => this.handleScroll());

        // Newsletter Form
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSignup();
            });
        }

        // Edit Profile Button
        const editProfileBtn = document.getElementById('editProfileBtn');
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', () => {
                this.showNotification('Feature Coming Soon', 'Profile editing will be available in the next update.', 'info');
            });
        }

        // Logout Button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Donate Button
        const donateBtn = document.querySelector('.btn-donate');
        if (donateBtn) {
            donateBtn.addEventListener('click', () => {
                this.showNotification('Thank You!', 'Donation feature will be implemented soon.', 'info');
            });
        }
        
        console.log('Event listeners set up successfully');
    },

    // Load Initial Data
    loadInitialData: function() {
        console.log('Loading initial data...');
        
        // Load theme preference
        const savedTheme = localStorage.getItem('talentconnect-theme');
        if (savedTheme) {
            this.state.theme = savedTheme;
            document.documentElement.className = savedTheme + '-theme';
            this.updateThemeToggleIcon();
        } else {
            // Default to light theme
            this.state.theme = 'light';
            document.documentElement.className = 'light-theme';
        }

        // Load user data
        const savedUser = localStorage.getItem('talentconnect-user');
        if (savedUser) {
            try {
                this.state.currentUser = JSON.parse(savedUser);
            } catch (e) {
                console.error('Error parsing saved user:', e);
                localStorage.removeItem('talentconnect-user');
            }
        }

        // Load conferences
        const savedConferences = localStorage.getItem('talentconnect-conferences');
        if (savedConferences) {
            try {
                const allConferences = JSON.parse(savedConferences);
                this.state.conferences = allConferences.filter(c => c.approved);
                this.state.pendingConferences = allConferences.filter(c => !c.approved);
            } catch (e) {
                console.error('Error parsing saved conferences:', e);
                this.loadDefaultConferences();
            }
        } else {
            this.loadDefaultConferences();
        }

        // Initialize countdown timer
        this.initializeCountdown();
        
        console.log('Initial data loaded');
    },

    loadDefaultConferences: function() {
        this.state.conferences = this.defaultData.approvedConferences;
        this.state.pendingConferences = [];
        this.saveAllConferences();
    },

    saveAllConferences: function() {
        const allConferences = [...this.state.conferences, ...this.state.pendingConferences];
        localStorage.setItem('talentconnect-conferences', JSON.stringify(allConferences));
    },

    // Update UI based on state
    updateUI: function() {
        console.log('Updating UI...');
        
        // Update auth buttons
        this.updateAuthButtons();

        // Render conferences
        this.renderConferences();

        // Update user presence count
        this.updateUserPresence();

        // Update stats counters
        this.animateCounters();
        
        console.log('UI updated');
    },

    // Start Animations
    startAnimations: function() {
        console.log('Starting animations...');
        
        // Simulate loading progress
        if (this.elements.loadingScreen) {
            let progress = 0;
            const progressFill = document.querySelector('.progress-fill');
            const interval = setInterval(() => {
                progress += Math.random() * 20;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    setTimeout(() => {
                        this.elements.loadingScreen.classList.add('hidden');
                        setTimeout(() => {
                            this.elements.loadingScreen.style.display = 'none';
                        }, 500);
                    }, 300);
                }
                if (progressFill) {
                    progressFill.style.width = progress + '%';
                }
            }, 100);
        }

        // Create particles
        this.createParticles();
        
        console.log('Animations started');
    },

    // Theme Management
    toggleTheme: function() {
        this.state.theme = this.state.theme === 'light' ? 'dark' : 'light';
        document.documentElement.className = this.state.theme + '-theme';
        localStorage.setItem('talentconnect-theme', this.state.theme);
        this.updateThemeToggleIcon();
        this.showNotification('Theme Changed', `Switched to ${this.state.theme} theme`, 'info');
    },

    updateThemeToggleIcon: function() {
        if (!this.elements.themeToggle) return;
        
        const icon = this.elements.themeToggle.querySelector('i');
        if (this.state.theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    },

    // Mobile Menu
    toggleMobileMenu: function() {
        this.state.mobileMenuOpen = !this.state.mobileMenuOpen;
        this.elements.mobileMenuBtn.classList.toggle('active');
        this.elements.mainNav.classList.toggle('active');
        this.elements.mobileMenuBtn.setAttribute('aria-expanded', this.state.mobileMenuOpen);
    },

    // Modal Management
    openModal: function(modalName) {
        this.closeAllModals();
        this.state.modals[modalName] = true;
        this.elements.modals[modalName].classList.add('active');
        this.elements.modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    closeAllModals: function() {
        Object.keys(this.state.modals).forEach(modal => {
            this.state.modals[modal] = false;
            if (this.elements.modals[modal]) {
                this.elements.modals[modal].classList.remove('active');
            }
        });
        this.elements.modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    },

    // Auth Management
    updateAuthButtons: function() {
        if (!this.elements.authButtonsContainer) return;

        if (this.state.currentUser) {
            let buttonsHTML = '';
            
            if (this.state.currentUser.role === 'admin') {
                buttonsHTML = `
                    <button class="btn btn-outline btn-profile" id="profileBtn">
                        <i class="fas fa-user-shield"></i>
                        Admin Panel
                    </button>
                `;
            } else {
                buttonsHTML = `
                    <button class="btn btn-outline btn-profile" id="profileBtn">
                        <i class="fas fa-user-circle"></i>
                        Profile
                    </button>
                `;
                
                if (this.state.currentUser.role === 'host') {
                    buttonsHTML += `
                        <button class="btn btn-primary btn-create-event" id="createEventBtn">
                            <i class="fas fa-plus"></i>
                            Host Event
                        </button>
                    `;
                }
            }
            
            buttonsHTML += `
                <button class="btn btn-danger btn-logout" id="logoutBtn">
                    <i class="fas fa-sign-out-alt"></i>
                    Logout
                </button>
            `;
            
            this.elements.authButtonsContainer.innerHTML = buttonsHTML;

            // Re-attach event listeners
            const profileBtn = document.getElementById('profileBtn');
            if (profileBtn) {
                if (this.state.currentUser.role === 'admin') {
                    profileBtn.addEventListener('click', () => this.openModal('adminPanel'));
                } else {
                    profileBtn.addEventListener('click', () => this.openModal('profile'));
                }
            }

            const createEventBtn = document.getElementById('createEventBtn');
            if (createEventBtn) {
                createEventBtn.addEventListener('click', () => this.openModal('createEvent'));
            }

            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => this.handleLogout());
            }
        } else {
            this.elements.authButtonsContainer.innerHTML = `
                <button class="btn btn-outline btn-signin" id="signInBtn">Sign In</button>
                <button class="btn btn-primary btn-signup" id="signUpBtn">Sign Up</button>
            `;
            
            // Re-attach event listeners
            const signInBtn = document.getElementById('signInBtn');
            const signUpBtn = document.getElementById('signUpBtn');
            if (signInBtn) signInBtn.addEventListener('click', () => this.openModal('signIn'));
            if (signUpBtn) signUpBtn.addEventListener('click', () => {
                // Show sign in modal with role selection
                this.openModal('signIn');
            });
        }
    },

    handleSignIn: function() {
        const email = document.getElementById('signInEmail')?.value;
        const password = document.getElementById('signInPassword')?.value;
        const selectedRole = document.querySelector('#signInModal .role-btn.active')?.dataset.role;
        const rememberMe = document.getElementById('rememberMe')?.checked;

        // Simple validation
        if (!email || !password) {
            this.showNotification('Validation Error', 'Please fill in all fields', 'error');
            return;
        }

        // Check credentials
        let user = null;
        
        // First check admin credentials
        if (selectedRole === 'admin') {
            if (email === "w2227021@gmail.com" && password === "11111111") {
                user = {
                    id: 2,
                    email: email,
                    firstName: "Admin",
                    lastName: "User",
                    role: "admin",
                    institution: "TalentConnect Pro"
                };
            } else {
                this.showNotification('Access Denied', 'Invalid admin credentials', 'error');
                return;
            }
        } else {
            // Check regular users
            const savedUsers = JSON.parse(localStorage.getItem('talentconnect-users') || '[]');
            user = savedUsers.find(u => u.email === email && u.password === password);
            
            if (!user) {
                // Check default users
                user = this.defaultData.users.find(u => u.email === email && u.password === password);
            }
            
            if (user && user.role !== selectedRole) {
                this.showNotification('Role Mismatch', `Please sign in as ${user.role}`, 'error');
                return;
            }
        }

        if (user) {
            this.state.currentUser = { ...user };
            if (rememberMe) {
                localStorage.setItem('talentconnect-user', JSON.stringify(this.state.currentUser));
            }
            
            let message = '';
            if (user.role === 'admin') {
                message = 'Welcome to Admin Panel!';
            } else if (user.role === 'host') {
                message = 'Welcome back, Host!';
            } else {
                message = 'Welcome back to TalentConnect Pro!';
            }
            
            this.showNotification('Success!', message, 'success');
            this.closeAllModals();
            this.updateAuthButtons();
            
            if (user.role === 'admin') {
                this.openAdminPanel();
            } else {
                this.updateProfileModal();
                this.openModal('profile');
            }
        } else {
            this.showNotification('Error', 'Invalid email or password', 'error');
        }
    },

    handleParticipantSignUp: function() {
        const formData = {
            firstName: document.getElementById('participantFirstName').value,
            lastName: document.getElementById('participantLastName').value,
            age: parseInt(document.getElementById('participantAge').value),
            educationLevel: document.getElementById('participantEducation').value,
            institution: document.getElementById('participantInstitution').value,
            email: document.getElementById('participantEmail').value,
            disabilityType: document.getElementById('participantDisabilityType').value,
            otherDisability: document.getElementById('participantOtherDisabilityField').style.display === 'block' 
                ? document.getElementById('participantOtherDisability').value 
                : '',
            password: document.getElementById('participantPassword').value,
            confirmPassword: document.getElementById('participantConfirmPassword').value
        };

        // Validation
        if (!this.validateParticipantForm(formData)) return;

        // Check if user already exists
        const savedUsers = JSON.parse(localStorage.getItem('talentconnect-users') || '[]');
        if (savedUsers.some(u => u.email === formData.email)) {
            this.showNotification('Error', 'User with this email already exists', 'error');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            ...formData,
            role: 'participant',
            eventsAttended: 0,
            connections: 0,
            createdAt: new Date().toISOString()
        };

        // Save to localStorage
        savedUsers.push(newUser);
        localStorage.setItem('talentconnect-users', JSON.stringify(savedUsers));
        localStorage.setItem('talentconnect-user', JSON.stringify(newUser));
        
        this.state.currentUser = newUser;
        this.showNotification('Success!', 'Participant account created successfully!', 'success');
        this.closeAllModals();
        this.updateAuthButtons();
        this.updateProfileModal();
        this.openModal('profile');
    },

    handleHostSignUp: function() {
        const formData = {
            firstName: document.getElementById('hostFirstName').value,
            lastName: document.getElementById('hostLastName').value,
            email: document.getElementById('hostEmail').value,
            institution: document.getElementById('hostInstitution').value,
            designation: document.getElementById('hostDesignation').value,
            contact: document.getElementById('hostContact').value,
            address: document.getElementById('hostAddress').value,
            studentCount: document.getElementById('hostStudentCount').value,
            password: document.getElementById('hostPassword').value,
            confirmPassword: document.getElementById('hostConfirmPassword').value
        };

        // Validation
        if (!this.validateHostForm(formData)) return;

        // Check if user already exists
        const savedUsers = JSON.parse(localStorage.getItem('talentconnect-users') || '[]');
        if (savedUsers.some(u => u.email === formData.email)) {
            this.showNotification('Error', 'User with this email already exists', 'error');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            ...formData,
            role: 'host',
            eventsHosted: 0,
            createdAt: new Date().toISOString()
        };

        // Save to localStorage
        savedUsers.push(newUser);
        localStorage.setItem('talentconnect-users', JSON.stringify(savedUsers));
        localStorage.setItem('talentconnect-user', JSON.stringify(newUser));
        
        this.state.currentUser = newUser;
        this.showNotification('Success!', 'Host account created successfully!', 'success');
        this.closeAllModals();
        this.updateAuthButtons();
        this.updateProfileModal();
        this.openModal('profile');
    },

    validateParticipantForm: function(formData) {
        if (!formData.firstName || !formData.lastName || !formData.age || !formData.educationLevel || 
            !formData.institution || !formData.email || !formData.password || !formData.confirmPassword) {
            this.showNotification('Validation Error', 'Please fill in all required fields', 'error');
            return false;
        }

        if (formData.age < 16 || formData.age > 99) {
            this.showNotification('Validation Error', 'Age must be between 16 and 99', 'error');
            return false;
        }

        if (formData.password.length < 8) {
            this.showNotification('Validation Error', 'Password must be at least 8 characters long', 'error');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            this.showNotification('Validation Error', 'Passwords do not match', 'error');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            this.showNotification('Validation Error', 'Please enter a valid email address', 'error');
            return false;
        }

        return true;
    },

    validateHostForm: function(formData) {
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.institution || 
            !formData.designation || !formData.contact || !formData.address || !formData.studentCount || 
            !formData.password || !formData.confirmPassword) {
            this.showNotification('Validation Error', 'Please fill in all required fields', 'error');
            return false;
        }

        if (formData.password.length < 8) {
            this.showNotification('Validation Error', 'Password must be at least 8 characters long', 'error');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            this.showNotification('Validation Error', 'Passwords do not match', 'error');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            this.showNotification('Validation Error', 'Please enter a valid email address', 'error');
            return false;
        }

        return true;
    },

    handleStartJourney: function() {
        if (!this.state.currentUser) {
            this.showNotification('Get Started', 'Create your account to begin your journey!', 'info');
            this.openModal('signIn');
        } else {
            this.showNotification('Welcome Back!', 'Explore conferences and showcase your talent!', 'success');
            document.getElementById('conferences').scrollIntoView({ behavior: 'smooth' });
        }
    },

    handleLogout: function() {
        this.state.currentUser = null;
        localStorage.removeItem('talentconnect-user');
        this.closeAllModals();
        this.updateAuthButtons();
        this.showNotification('Logged Out', 'You have been successfully logged out', 'info');
    },

    updateProfileModal: function() {
        if (!this.state.currentUser) return;

        const user = this.state.currentUser;
        
        // Update avatar initials
        const initials = (user.firstName?.[0] || '') + (user.lastName?.[0] || '');
        const avatarInitials = document.getElementById('avatarInitials');
        if (avatarInitials) {
            avatarInitials.textContent = initials.toUpperCase();
        }

        // Update profile title
        const profileTitle = document.getElementById('profileTitle');
        if (profileTitle) {
            profileTitle.textContent = `${user.firstName} ${user.lastName}`;
        }

        // Update profile role
        const profileRole = document.querySelector('.profile-role');
        if (profileRole) {
            let roleIcon = 'fa-user-graduate';
            let roleText = 'Participant';
            
            if (user.role === 'host') {
                roleIcon = 'fa-user-tie';
                roleText = 'Host';
            } else if (user.role === 'admin') {
                roleIcon = 'fa-user-shield';
                roleText = 'Admin';
            }
            
            profileRole.innerHTML = `<i class="fas ${roleIcon}"></i> ${roleText}`;
        }

        // Update profile email
        const profileEmail = document.getElementById('profileEmail');
        if (profileEmail && user.email) {
            profileEmail.textContent = user.email;
        }

        // Update profile education
        const profileEducation = document.getElementById('profileEducation');
        if (profileEducation) {
            if (user.role === 'participant') {
                profileEducation.textContent = `${user.educationLevel} at ${user.institution}`;
            } else if (user.role === 'host') {
                profileEducation.textContent = `${user.designation} at ${user.institution}`;
            } else {
                profileEducation.textContent = user.institution || 'Administrator';
            }
        }

        // Update profile disability
        const profileDisability = document.getElementById('profileDisability');
        if (profileDisability) {
            if (user.role === 'participant' && user.disabilityType) {
                const disabilityMap = {
                    'visual': 'Visual Impairment',
                    'hearing': 'Hearing Impairment',
                    'mobility': 'Mobility Impairment',
                    'cognitive': 'Cognitive Disability',
                    'multiple': 'Multiple Disabilities',
                    'none': 'No Disability',
                    'other': user.otherDisability || 'Other Disability'
                };
                profileDisability.textContent = disabilityMap[user.disabilityType] || 'Not specified';
            } else {
                profileDisability.textContent = user.role === 'host' ? 'Host' : 'Admin';
            }
        }

        // Update profile stats
        const statValues = document.querySelectorAll('.stat-value');
        if (statValues.length >= 3) {
            if (user.role === 'participant') {
                statValues[0].textContent = user.eventsAttended || 0;
                statValues[1].textContent = '0';
                statValues[2].textContent = user.connections || 0;
            } else if (user.role === 'host') {
                const hostedEvents = this.state.conferences.filter(c => c.hostId === user.id).length;
                statValues[0].textContent = '0';
                statValues[1].textContent = hostedEvents;
                statValues[2].textContent = 'N/A';
            } else {
                statValues[0].textContent = this.state.pendingConferences.length;
                statValues[1].textContent = this.state.conferences.length;
                statValues[2].textContent = 'N/A';
            }
        }
    },

    // Event Management
    showEventConfirmation: function() {
        // Get form data
        const formData = {
            title: document.getElementById('eventTitle').value,
            description: document.getElementById('eventDescription').value,
            date: document.getElementById('eventDate').value,
            time: document.getElementById('eventTime').value,
            duration: parseInt(document.getElementById('eventDuration').value),
            link: document.getElementById('eventLink').value,
            maxParticipants: parseInt(document.getElementById('maxParticipants').value),
            category: document.getElementById('eventCategory').value,
            tags: document.getElementById('eventTags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
            accessibility: Array.from(document.querySelectorAll('input[name="accessibility"]:checked')).map(cb => cb.value),
            requirements: document.getElementById('eventRequirements').value
        };

        // Validation
        if (!this.validateEventForm(formData)) return;

        // Store form data temporarily
        this.pendingEventData = formData;

        // Show confirmation modal
        const confirmationTitle = document.getElementById('confirmationTitle');
        const confirmationMessage = document.getElementById('confirmationMessage');
        
        if (confirmationTitle && confirmationMessage) {
            confirmationTitle.textContent = 'Confirm Conference Submission';
            confirmationMessage.textContent = `Are you sure you want to submit "${formData.title}"? This conference will be reviewed by admin before being published.`;
        }

        this.openModal('confirmation');
    },

    handleCreateEvent: function() {
        if (!this.state.currentUser || this.state.currentUser.role !== 'host') {
            this.showNotification('Permission Denied', 'Only hosts can create events', 'error');
            return;
        }

        if (!this.pendingEventData) {
            this.showNotification('Error', 'No event data to submit', 'error');
            return;
        }

        const formData = this.pendingEventData;
        const user = this.state.currentUser;

        // Create new conference (pending approval)
        const newConference = {
            id: Date.now(),
            ...formData,
            host: `${user.firstName} ${user.lastName}`,
            hostId: user.id,
            hostInstitution: user.institution,
            hostContact: user.contact,
            registeredParticipants: 0,
            status: 'pending',
            approved: false,
            submittedAt: new Date().toISOString()
        };

        // Add to pending conferences
        this.state.pendingConferences.push(newConference);
        this.saveAllConferences();

        // Show success message
        this.showNotification('Success!', 'Conference submitted for admin approval. You will be notified once approved.', 'success');
        
        // Send email notification (simulated)
        this.sendEventSubmissionEmail(newConference);
        
        // Close modals and reset form
        this.closeAllModals();
        this.pendingEventData = null;
        document.getElementById('createEventForm').reset();
        
        // Update admin panel if admin is logged in
        if (this.state.currentUser?.role === 'admin') {
            this.updateAdminPanel();
        }
    },

    validateEventForm: function(formData) {
        if (!formData.title || !formData.description || !formData.date || !formData.time || 
            !formData.duration || !formData.link || !formData.maxParticipants || !formData.category) {
            this.showNotification('Validation Error', 'Please fill in all required fields', 'error');
            return false;
        }

        // Check if date is in the future
        const eventDateTime = new Date(formData.date + 'T' + formData.time);
        if (eventDateTime < new Date()) {
            this.showNotification('Validation Error', 'Event date and time must be in the future', 'error');
            return false;
        }

        // Check if link is valid URL
        try {
            new URL(formData.link);
        } catch (e) {
            this.showNotification('Validation Error', 'Please enter a valid conference link', 'error');
            return false;
        }

        return true;
    },

    sendEventSubmissionEmail: function(conference) {
        console.log(`Event submission email sent to host: ${conference.host}`);
        console.log(`Conference: ${conference.title}`);
        console.log(`Status: Pending admin approval`);
        
        // Simulate email notification
        const emailNotification = document.createElement('div');
        emailNotification.className = 'email-notification';
        emailNotification.innerHTML = `
            <div class="email-notification-content">
                <div class="email-icon">
                    <i class="fas fa-paper-plane"></i>
                </div>
                <div class="email-text">
                    <p><strong>Conference Submitted for Approval</strong></p>
                    <p>Your conference "${conference.title}" has been submitted and is pending admin approval.</p>
                </div>
                <button class="email-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(emailNotification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (emailNotification.parentNode) {
                emailNotification.classList.add('fade-out');
                setTimeout(() => emailNotification.remove(), 300);
            }
        }, 5000);
        
        // Close button
        emailNotification.querySelector('.email-close').addEventListener('click', () => {
            emailNotification.classList.add('fade-out');
            setTimeout(() => emailNotification.remove(), 300);
        });
    },

    // Conference Display
    renderConferences: function() {
        if (!this.elements.conferenceGrid) {
            console.error('Conference grid not found');
            return;
        }

        // Get user's registrations
        const registrations = JSON.parse(localStorage.getItem('talentconnect-registrations') || '[]');
        const userRegistrations = this.state.currentUser 
            ? registrations.filter(r => r.userId === this.state.currentUser.id)
            : [];

        this.elements.conferenceGrid.innerHTML = this.state.conferences.map(conference => {
            const isRegistered = userRegistrations.some(r => r.conferenceId === conference.id);
            const isFull = conference.registeredParticipants >= conference.maxParticipants;
            
            // Determine status
            let status = conference.status;
            const now = new Date();
            const eventDateTime = new Date(conference.date + 'T' + conference.time);
            const endDateTime = new Date(eventDateTime.getTime() + conference.duration * 60000);
            
            if (status === 'approved') {
                if (now >= eventDateTime && now <= endDateTime) {
                    status = 'live';
                } else if (now > endDateTime) {
                    status = 'ended';
                } else {
                    status = 'upcoming';
                }
            }
            
            return `
                <div class="conference-card" data-id="${conference.id}" data-category="${conference.category}" data-status="${status}">
                    <div class="conference-status status-${status}">
                        ${status === 'live' ? 'Live Now' : status === 'upcoming' ? 'Upcoming' : 'Ended'}
                    </div>
                    <div class="conference-content">
                        <div class="conference-header">
                            <div>
                                <h3 class="conference-title">${conference.title}</h3>
                                <div class="conference-host">
                                    <i class="fas fa-user-tie"></i>
                                    <span>Hosted by ${conference.host}</span>
                                </div>
                            </div>
                        </div>
                        
                        <p class="conference-description">${conference.description}</p>
                        
                        <div class="conference-meta">
                            <div class="meta-item">
                                <i class="fas fa-calendar"></i>
                                <span>${this.formatDate(conference.date)}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-clock"></i>
                                <span>${conference.time} (${conference.duration} mins)</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-users"></i>
                                <span>${conference.registeredParticipants}/${conference.maxParticipants}</span>
                            </div>
                            ${isRegistered ? `
                                <div class="meta-item registered-badge">
                                    <i class="fas fa-check-circle"></i>
                                    <span>Registered</span>
                                </div>
                            ` : ''}
                        </div>
                        
                        <div class="conference-progress">
                            <div class="progress-header">
                                <span>Registration Progress</span>
                                <span>${Math.round((conference.registeredParticipants / conference.maxParticipants) * 100)}%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${(conference.registeredParticipants / conference.maxParticipants) * 100}%"></div>
                            </div>
                        </div>
                        
                        <div class="accessibility-badges">
                            ${conference.accessibility.map(feature => `
                                <div class="badge">
                                    <i class="fas fa-${this.getAccessibilityIcon(feature)}"></i>
                                    <span>${this.getAccessibilityLabel(feature)}</span>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="conference-actions">
                            ${status === 'live' ? `
                                ${isRegistered ? `
                                    <button class="btn btn-success btn-join" data-id="${conference.id}">
                                        <i class="fas fa-video"></i>
                                        Join Now
                                    </button>
                                ` : `
                                    <button class="btn btn-outline" disabled>
                                        <i class="fas fa-video"></i>
                                        Registration Required
                                    </button>
                                `}
                            ` : status === 'upcoming' ? `
                                ${isRegistered ? `
                                    <button class="btn btn-success" disabled>
                                        <i class="fas fa-check-circle"></i>
                                        Already Registered
                                    </button>
                                ` : isFull ? `
                                    <button class="btn btn-outline" disabled>
                                        <i class="fas fa-user-clock"></i>
                                        Conference Full
                                    </button>
                                ` : `
                                    <button class="btn btn-primary btn-register" data-id="${conference.id}">
                                        <i class="fas fa-user-plus"></i>
                                        Register Now
                                    </button>
                                `}
                            ` : `
                                <button class="btn btn-outline" disabled>
                                    <i class="fas fa-clock"></i>
                                    Event Ended
                                </button>
                            `}
                            <button class="btn btn-outline btn-details" data-id="${conference.id}">
                                <i class="fas fa-info-circle"></i>
                                Details
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Add event listeners to conference buttons
        this.addConferenceEventListeners();
    },

    filterConferences: function(filter) {
        const cards = document.querySelectorAll('.conference-card');
        cards.forEach(card => {
            const category = card.dataset.category;
            const status = card.dataset.status;
            
            let show = false;
            if (filter === 'all') {
                show = true;
            } else if (filter === 'upcoming' && status === 'upcoming') {
                show = true;
            } else if (filter === 'live' && status === 'live') {
                show = true;
            } else if (filter === 'tech' && category === 'tech') {
                show = true;
            } else if (filter === 'creative' && category === 'creative') {
                show = true;
            }
            
            card.style.display = show ? 'block' : 'none';
        });
    },

    addConferenceEventListeners: function() {
        // Register buttons
        document.querySelectorAll('.btn-register').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const conferenceId = parseInt(e.target.dataset.id);
                this.handleConferenceRegistration(conferenceId);
            });
        });

        // Join buttons
        document.querySelectorAll('.btn-join').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const conferenceId = parseInt(e.target.dataset.id);
                this.handleJoinConference(conferenceId);
            });
        });

        // Details buttons
        document.querySelectorAll('.btn-details').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const conferenceId = parseInt(e.target.dataset.id);
                this.showConferenceDetails(conferenceId);
            });
        });
    },

    handleConferenceRegistration: function(conferenceId) {
        if (!this.state.currentUser) {
            this.showNotification('Authentication Required', 'Please sign in to register for conferences', 'info');
            this.openModal('signIn');
            return;
        }

        if (this.state.currentUser.role !== 'participant') {
            this.showNotification('Access Denied', 'Only participants can register for conferences', 'error');
            return;
        }

        const conference = this.state.conferences.find(c => c.id === conferenceId);
        if (!conference) return;

        // Check if user is already registered
        const registrations = JSON.parse(localStorage.getItem('talentconnect-registrations') || '[]');
        const userRegistration = registrations.find(r => 
            r.userId === this.state.currentUser.id && r.conferenceId === conferenceId
        );

        if (userRegistration) {
            this.showNotification('Already Registered', 'You have already registered for this conference', 'info');
            return;
        }

        if (conference.registeredParticipants >= conference.maxParticipants) {
            this.showNotification('Conference Full', 'This conference has reached maximum capacity', 'warning');
            return;
        }

        // Register user
        conference.registeredParticipants++;
        registrations.push({
            id: Date.now(),
            userId: this.state.currentUser.id,
            conferenceId: conferenceId,
            registeredAt: new Date().toISOString(),
            status: 'registered'
        });
        
        localStorage.setItem('talentconnect-registrations', JSON.stringify(registrations));
        this.saveAllConferences();
        
        this.showNotification('Success!', `You've registered for "${conference.title}"`, 'success');
        this.renderConferences();
    },

    handleJoinConference: function(conferenceId) {
        if (!this.state.currentUser) {
            this.showNotification('Authentication Required', 'Please sign in to join conferences', 'info');
            this.openModal('signIn');
            return;
        }

        const conference = this.state.conferences.find(c => c.id === conferenceId);
        if (!conference) return;

        // Check if user is registered
        const registrations = JSON.parse(localStorage.getItem('talentconnect-registrations') || '[]');
        const userRegistration = registrations.find(r => 
            r.userId === this.state.currentUser.id && r.conferenceId === conferenceId
        );

        if (!userRegistration) {
            this.showNotification('Registration Required', 'Please register for this conference first', 'error');
            return;
        }

        // Open conference link in new tab
        window.open(conference.link, '_blank', 'noopener,noreferrer');
        this.showNotification('Joining Conference', 'Opening conference link...', 'info');
    },

    showConferenceDetails: function(conferenceId) {
        const conference = this.state.conferences.find(c => c.id === conferenceId);
        if (!conference) return;

        const detailsHTML = `
            <div class="details-section">
                <h4>Conference Title</h4>
                <p>${conference.title}</p>
            </div>
            
            <div class="details-section">
                <h4>Host</h4>
                <p>${conference.host}${conference.hostInstitution ? ` (${conference.hostInstitution})` : ''}</p>
            </div>
            
            <div class="details-section">
                <h4>Description</h4>
                <p>${conference.description}</p>
            </div>
            
            <div class="details-section">
                <h4>Date & Time</h4>
                <p>${this.formatDate(conference.date)} at ${conference.time}</p>
                <p>Duration: ${conference.duration} minutes</p>
            </div>
            
            <div class="details-section">
                <h4>Conference Link</h4>
                <p><a href="${conference.link}" target="_blank" rel="noopener noreferrer">${conference.link}</a></p>
            </div>
            
            <div class="details-section">
                <h4>Participants</h4>
                <p>${conference.registeredParticipants} registered / ${conference.maxParticipants} maximum</p>
            </div>
            
            <div class="details-section">
                <h4>Accessibility Features</h4>
                <div class="accessibility-list">
                    ${conference.accessibility.map(feature => `
                        <div class="badge">
                            <i class="fas fa-${this.getAccessibilityIcon(feature)}"></i>
                            <span>${this.getAccessibilityLabel(feature)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            ${conference.requirements ? `
                <div class="details-section">
                    <h4>Special Requirements</h4>
                    <p>${conference.requirements}</p>
                </div>
            ` : ''}
            
            ${conference.tags && conference.tags.length > 0 ? `
                <div class="details-section">
                    <h4>Tags</h4>
                    <p>${conference.tags.join(', ')}</p>
                </div>
            ` : ''}
        `;

        const detailsBody = document.getElementById('conferenceDetailsBody');
        if (detailsBody) {
            detailsBody.innerHTML = detailsHTML;
        }

        const detailsTitle = document.getElementById('conferenceDetailsTitle');
        if (detailsTitle) {
            detailsTitle.textContent = conference.title;
        }

        this.openModal('conferenceDetails');
    },

    // Admin Panel
    openAdminPanel: function() {
        this.updateAdminPanel();
        this.openModal('adminPanel');
    },

    updateAdminPanel: function() {
        const pendingCount = document.getElementById('pendingCount');
        const approvedCount = document.getElementById('approvedCount');
        const declinedCount = document.getElementById('declinedCount');
        const adminTable = document.getElementById('adminConferencesTable');
        const noPendingMessage = document.getElementById('noPendingMessage');

        if (pendingCount) pendingCount.textContent = this.state.pendingConferences.length;
        if (approvedCount) approvedCount.textContent = this.state.conferences.length;
        if (declinedCount) declinedCount.textContent = 0; // Track declined conferences if needed

        if (adminTable) {
            adminTable.innerHTML = this.state.pendingConferences.map(conference => `
                <tr data-id="${conference.id}">
                    <td><strong>${conference.title}</strong></td>
                    <td>${conference.host}<br><small>${conference.hostInstitution}</small></td>
                    <td>${this.formatDate(conference.date)}<br><small>${conference.time}</small></td>
                    <td>${conference.maxParticipants} max</td>
                    <td class="status-pending">Pending Review</td>
                    <td>
                        <div class="admin-actions">
                            <button class="btn btn-sm btn-approve" data-id="${conference.id}">
                                <i class="fas fa-check"></i> Approve
                            </button>
                            <button class="btn btn-sm btn-decline" data-id="${conference.id}">
                                <i class="fas fa-times"></i> Decline
                            </button>
                            <button class="btn btn-sm btn-outline btn-view-details" data-id="${conference.id}">
                                <i class="fas fa-eye"></i> View
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');

            // Add event listeners
            adminTable.querySelectorAll('.btn-approve').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const conferenceId = parseInt(e.target.closest('.btn-approve').dataset.id);
                    this.approveConference(conferenceId);
                });
            });

            adminTable.querySelectorAll('.btn-decline').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const conferenceId = parseInt(e.target.closest('.btn-decline').dataset.id);
                    this.declineConference(conferenceId);
                });
            });

            adminTable.querySelectorAll('.btn-view-details').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const conferenceId = parseInt(e.target.closest('.btn-view-details').dataset.id);
                    this.showAdminConferenceDetails(conferenceId);
                });
            });
        }

        // Show/hide no pending message
        if (noPendingMessage) {
            noPendingMessage.style.display = this.state.pendingConferences.length === 0 ? 'block' : 'none';
        }
    },

    approveConference: function(conferenceId) {
        const conferenceIndex = this.state.pendingConferences.findIndex(c => c.id === conferenceId);
        if (conferenceIndex === -1) return;

        const conference = this.state.pendingConferences[conferenceIndex];
        
        // Move from pending to approved
        conference.approved = true;
        conference.status = 'approved';
        conference.approvedAt = new Date().toISOString();
        
        this.state.conferences.push(conference);
        this.state.pendingConferences.splice(conferenceIndex, 1);
        
        this.saveAllConferences();
        this.updateAdminPanel();
        this.renderConferences();
        
        this.showNotification('Conference Approved', `"${conference.title}" has been published`, 'success');
        
        // Send notification to host (simulated)
        console.log(`Notification sent to host: ${conference.host} - Conference approved`);
    },

    declineConference: function(conferenceId) {
        const conferenceIndex = this.state.pendingConferences.findIndex(c => c.id === conferenceId);
        if (conferenceIndex === -1) return;

        const conference = this.state.pendingConferences[conferenceIndex];
        this.state.pendingConferences.splice(conferenceIndex, 1);
        
        // Save declined conference separately if needed
        const declinedConferences = JSON.parse(localStorage.getItem('talentconnect-declined') || '[]');
        declinedConferences.push({
            ...conference,
            declinedAt: new Date().toISOString()
        });
        localStorage.setItem('talentconnect-declined', JSON.stringify(declinedConferences));
        
        this.saveAllConferences();
        this.updateAdminPanel();
        
        this.showNotification('Conference Declined', `"${conference.title}" has been declined`, 'warning');
        
        // Send notification to host (simulated)
        console.log(`Notification sent to host: ${conference.host} - Conference declined`);
    },

    showAdminConferenceDetails: function(conferenceId) {
        const conference = this.state.pendingConferences.find(c => c.id === conferenceId);
        if (!conference) return;

        const detailsHTML = `
            <div class="details-section">
                <h4>Conference Title</h4>
                <p><strong>${conference.title}</strong></p>
            </div>
            
            <div class="details-section">
                <h4>Host Information</h4>
                <p><strong>Name:</strong> ${conference.host}</p>
                <p><strong>Institution:</strong> ${conference.hostInstitution || 'Not specified'}</p>
                <p><strong>Contact:</strong> ${conference.hostContact || 'Not specified'}</p>
                <p><strong>Submitted:</strong> ${new Date(conference.submittedAt).toLocaleString()}</p>
            </div>
            
            <div class="details-section">
                <h4>Description</h4>
                <p>${conference.description}</p>
            </div>
            
            <div class="details-section">
                <h4>Event Details</h4>
                <p><strong>Date:</strong> ${this.formatDate(conference.date)}</p>
                <p><strong>Time:</strong> ${conference.time}</p>
                <p><strong>Duration:</strong> ${conference.duration} minutes</p>
                <p><strong>Max Participants:</strong> ${conference.maxParticipants}</p>
                <p><strong>Conference Link:</strong> <a href="${conference.link}" target="_blank">${conference.link}</a></p>
            </div>
            
            <div class="details-section">
                <h4>Accessibility Features</h4>
                <div class="accessibility-list">
                    ${conference.accessibility.map(feature => `
                        <div class="badge">
                            <i class="fas fa-${this.getAccessibilityIcon(feature)}"></i>
                            <span>${this.getAccessibilityLabel(feature)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            ${conference.requirements ? `
                <div class="details-section">
                    <h4>Special Requirements</h4>
                    <p>${conference.requirements}</p>
                </div>
            ` : ''}
            
            ${conference.tags && conference.tags.length > 0 ? `
                <div class="details-section">
                    <h4>Tags</h4>
                    <p>${conference.tags.join(', ')}</p>
                </div>
            ` : ''}
        `;

        const detailsBody = document.getElementById('conferenceDetailsBody');
        if (detailsBody) {
            detailsBody.innerHTML = detailsHTML;
        }

        const detailsTitle = document.getElementById('conferenceDetailsTitle');
        if (detailsTitle) {
            detailsTitle.textContent = `Review: ${conference.title}`;
        }

        this.closeAllModals();
        this.openModal('conferenceDetails');
    },

    // Utility Functions
    formatDate: function(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        } catch (e) {
            return dateString;
        }
    },

    getAccessibilityIcon: function(feature) {
        const icons = {
            'captioning': 'closed-captioning',
            'sign-language': 'sign-language',
            'screen-reader': 'assistive-listening-systems',
            'high-contrast': 'adjust',
            'keyboard-nav': 'keyboard',
            'audio-description': 'audio-description'
        };
        return icons[feature] || 'universal-access';
    },

    getAccessibilityLabel: function(feature) {
        const labels = {
            'captioning': 'Closed Captioning',
            'sign-language': 'Sign Language',
            'screen-reader': 'Screen Reader',
            'high-contrast': 'High Contrast',
            'keyboard-nav': 'Keyboard Nav',
            'audio-description': 'Audio Description'
        };
        return labels[feature] || feature;
    },

    updatePasswordStrength: function(password, formType) {
        const strengthBar = document.querySelector(`#${formType}SignUpForm .strength-bar`);
        const strengthText = document.querySelector(`#${formType}SignUpForm .strength-text`);
        
        if (!strengthBar || !strengthText) return;
        
        let strength = 0;
        if (password.length >= 8) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        if (/[^A-Za-z0-9]/.test(password)) strength += 25;
        
        strengthBar.style.width = strength + '%';
        
        if (strength < 50) {
            strengthBar.style.background = 'var(--danger-color)';
            strengthText.textContent = 'Weak password';
            strengthText.style.color = 'var(--danger-color)';
        } else if (strength < 75) {
            strengthBar.style.background = 'var(--warning-color)';
            strengthText.textContent = 'Fair password';
            strengthText.style.color = 'var(--warning-color)';
        } else {
            strengthBar.style.background = 'var(--success-color)';
            strengthText.textContent = 'Strong password';
            strengthText.style.color = 'var(--success-color)';
        }
    },

    // Animations
    animateCounters: function() {
        // Animate hero stats
        const heroCounters = document.querySelectorAll('.hero-stats .stat-number');
        heroCounters.forEach(counter => {
            const target = parseInt(counter.dataset.count);
            this.animateCounter(counter, target, 2000);
        });
        
        // Animate about stats
        const aboutCounters = document.querySelectorAll('.about-stats .stat-number');
        aboutCounters.forEach(counter => {
            const target = parseInt(counter.dataset.count);
            this.animateCounter(counter, target, 2000);
        });
    },

    animateCounter: function(element, target, duration) {
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + (element.dataset.count === '98' ? '%' : '+');
            }
        };
        
        updateCounter();
    },

    updateUserPresence: function() {
        const userCount = document.querySelector('.user-count');
        if (userCount) {
            // Simulate random user count changes
            const baseCount = 1247;
            const randomChange = Math.floor(Math.random() * 50) - 25;
            userCount.textContent = (baseCount + randomChange).toLocaleString();
        }
    },

    initializeCountdown: function() {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 12);
        endDate.setHours(18, 45, 0, 0);

        const updateCountdown = () => {
            const now = new Date();
            const diff = endDate - now;

            if (diff <= 0) {
                const daysEl = document.getElementById('days');
                const hoursEl = document.getElementById('hours');
                const minutesEl = document.getElementById('minutes');
                if (daysEl) daysEl.textContent = '00';
                if (hoursEl) hoursEl.textContent = '00';
                if (minutesEl) minutesEl.textContent = '00';
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            const daysEl = document.getElementById('days');
            const hoursEl = document.getElementById('hours');
            const minutesEl = document.getElementById('minutes');
            
            if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
            if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
            if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
        };

        updateCountdown();
        setInterval(updateCountdown, 60000);
    },

    // Custom Cursor
    updateCursor: function(e) {
        if (!this.elements.customCursor || !this.elements.cursorOutline) return;

        this.elements.customCursor.style.left = e.clientX + 'px';
        this.elements.customCursor.style.top = e.clientY + 'px';

        this.elements.cursorOutline.style.left = e.clientX + 'px';
        this.elements.cursorOutline.style.top = e.clientY + 'px';

        // Enlarge cursor on interactive elements
        const target = e.target;
        const isInteractive = target.tagName === 'BUTTON' || 
                             target.tagName === 'A' || 
                             target.tagName === 'INPUT' ||
                             target.tagName === 'SELECT' ||
                             target.tagName === 'TEXTAREA';

        if (isInteractive) {
            this.elements.customCursor.style.width = '16px';
            this.elements.customCursor.style.height = '16px';
            this.elements.cursorOutline.style.width = '60px';
            this.elements.cursorOutline.style.height = '60px';
        } else {
            this.elements.customCursor.style.width = '8px';
            this.elements.customCursor.style.height = '8px';
            this.elements.cursorOutline.style.width = '40px';
            this.elements.cursorOutline.style.height = '40px';
        }
    },

    // Scroll Effects
    handleScroll: function() {
        if (!this.elements.mainHeader) return;

        if (window.scrollY > 100) {
            this.elements.mainHeader.classList.add('scrolled');
        } else {
            this.elements.mainHeader.classList.remove('scrolled');
        }
    },

    // Particles Background
    createParticles: function() {
        const container = document.querySelector('.particles-container');
        if (!container) return;

        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 20 + 5;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.top = Math.random() * 100 + 'vh';
            
            const duration = Math.random() * 20 + 10;
            particle.style.animationDuration = duration + 's';
            particle.style.animationDelay = Math.random() * 5 + 's';
            
            container.appendChild(particle);
        }
    },

    // Newsletter Signup
    handleNewsletterSignup: function() {
        const emailInput = document.querySelector('.newsletter-form input[type="email"]');
        if (!emailInput) return;

        const email = emailInput.value;
        if (!email || !this.validateEmail(email)) {
            this.showNotification('Error', 'Please enter a valid email address', 'error');
            return;
        }

        // Simulate API call
        setTimeout(() => {
            this.showNotification('Success!', 'Thank you for subscribing to our newsletter!', 'success');
            emailInput.value = '';
        }, 500);
    },

    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Notification System
    showNotification: function(title, message, type = 'info') {
        if (!this.elements.toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
        `;

        this.elements.toastContainer.appendChild(toast);

        // Add close button event
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => toast.remove(), 300);
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'slideOutRight 0.3s ease-out forwards';
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    }
};

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Starting TalentConnectPro...');
    TalentConnectPro.init();
});

// Fallback initialization
window.addEventListener('load', () => {
    console.log('Window Loaded - Ensuring TalentConnectPro is initialized...');
    if (!TalentConnectPro.state.theme) {
        console.log('Re-initializing TalentConnectPro...');
        TalentConnectPro.init();
    }
});