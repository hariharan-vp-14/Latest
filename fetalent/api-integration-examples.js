/**
 * API Integration Examples for script.js
 * These are example functions to integrate the API service into your frontend
 * Copy these functions into your script.js where appropriate
 */

// ========== AUTHENTICATION FUNCTIONS ==========

/**
 * Handle User Registration Form Submission
 */
async function handleUserRegistration(formData) {
  try {
    // Show loading state
    showLoadingState(true);

    // Validate form data
    if (!validateUserRegistrationForm(formData)) {
      throw new Error('Please fill in all required fields');
    }

    // Prepare data
    const userData = {
      fullname: {
        firstname: formData.firstName,
        lastname: formData.lastName
      },
      age: parseInt(formData.age),
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      educationLevel: formData.educationLevel,
      institution: formData.institution,
      disabilityType: formData.disabilityType || 'None'
    };

    // Call API
    const response = await api.registerUser(userData);

    // Show success message
    showNotification('Registration successful! Please check your email to verify your account.', 'success');

    // Clear form
    clearForm(formData);

    // Redirect to login page
    setTimeout(() => {
      window.location.href = '#login';
    }, 2000);

    return response;
  } catch (error) {
    showNotification(`Registration failed: ${error.message}`, 'error');
    console.error('Registration error:', error);
  } finally {
    showLoadingState(false);
  }
}

/**
 * Handle User Login Form Submission
 */
async function handleUserLogin(email, password) {
  try {
    showLoadingState(true);

    // Validate inputs
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Call API
    const response = await api.loginUser(email, password);

    // Show success message
    showNotification('Login successful!', 'success');

    // Update UI to show logged-in state
    updateAuthUI();

    // Redirect to dashboard or home
    setTimeout(() => {
      window.location.href = '#dashboard';
    }, 1500);

    return response;
  } catch (error) {
    showNotification(`Login failed: ${error.message}`, 'error');
    console.error('Login error:', error);
  } finally {
    showLoadingState(false);
  }
}

/**
 * Handle User Logout
 */
async function handleUserLogout() {
  try {
    showLoadingState(true);

    // Call API to logout
    await api.userLogout();

    // Show success message
    showNotification('Logged out successfully', 'success');

    // Update UI
    updateAuthUI();

    // Redirect to home
    setTimeout(() => {
      window.location.href = '#home';
    }, 1000);
  } catch (error) {
    console.error('Logout error:', error);
    // Force logout even if API call fails
    api.logout();
    updateAuthUI();
  } finally {
    showLoadingState(false);
  }
}

/**
 * Handle Forgot Password
 */
async function handleForgotPassword(email) {
  try {
    showLoadingState(true);

    if (!email) {
      throw new Error('Email is required');
    }

    const response = await api.userForgotPassword(email);

    showNotification('Password reset link has been sent to your email', 'success');

    return response;
  } catch (error) {
    showNotification(`Failed: ${error.message}`, 'error');
    console.error('Forgot password error:', error);
  } finally {
    showLoadingState(false);
  }
}

/**
 * Handle Password Reset
 */
async function handlePasswordReset(token, password, confirmPassword) {
  try {
    showLoadingState(true);

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    const response = await api.userResetPassword(token, password, confirmPassword);

    showNotification('Password reset successful! You can now login with your new password.', 'success');

    setTimeout(() => {
      window.location.href = '#login';
    }, 2000);

    return response;
  } catch (error) {
    showNotification(`Failed: ${error.message}`, 'error');
    console.error('Password reset error:', error);
  } finally {
    showLoadingState(false);
  }
}

// ========== USER PROFILE FUNCTIONS ==========

/**
 * Load and Display User Profile
 */
async function loadUserProfile() {
  try {
    showLoadingState(true);

    // Check if user is authenticated
    if (!api.isAuthenticated()) {
      throw new Error('User is not authenticated');
    }

    // Get profile from API or use cached data
    const user = api.getCurrentUser() || await api.getUserProfile();

    // Update UI with profile data
    displayUserProfile(user);

    return user;
  } catch (error) {
    showNotification(`Failed to load profile: ${error.message}`, 'error');
    console.error('Profile loading error:', error);
  } finally {
    showLoadingState(false);
  }
}

/**
 * Update User Profile
 */
async function updateUserProfile(updatedData) {
  try {
    showLoadingState(true);

    // Note: You may need to add an updateUser endpoint to the backend
    // For now, this shows the structure

    showNotification('Profile update would go here', 'info');

    return updatedData;
  } catch (error) {
    showNotification(`Update failed: ${error.message}`, 'error');
    console.error('Profile update error:', error);
  } finally {
    showLoadingState(false);
  }
}

// ========== EVENT FUNCTIONS ==========

/**
 * Load and Display All Events
 */
async function loadAllEvents(filters = {}) {
  try {
    showLoadingState(true);

    // Call API to get all events
    const response = await api.getAllEvents(filters);

    // Update state with events
    TalentConnectPro.state.conferences = response.events || [];

    // Render events
    renderEventsList(TalentConnectPro.state.conferences);

    return response;
  } catch (error) {
    showNotification(`Failed to load events: ${error.message}`, 'error');
    console.error('Events loading error:', error);

    // Fallback to empty array
    TalentConnectPro.state.conferences = [];
  } finally {
    showLoadingState(false);
  }
}

/**
 * Get Single Event Details
 */
async function getEventDetails(eventId) {
  try {
    showLoadingState(true);

    const event = await api.getEventById(eventId);

    displayEventDetails(event);

    return event;
  } catch (error) {
    showNotification(`Failed to load event: ${error.message}`, 'error');
    console.error('Event details error:', error);
  } finally {
    showLoadingState(false);
  }
}

/**
 * Register for an Event
 */
async function registerForEvent(eventId) {
  try {
    // Check authentication
    if (!api.isAuthenticated()) {
      showNotification('Please login to register for events', 'warning');
      return;
    }

    showLoadingState(true);

    const response = await api.registerForEvent(eventId);

    showNotification('Successfully registered for event!', 'success');

    // Refresh events list
    await loadAllEvents();

    return response;
  } catch (error) {
    showNotification(`Registration failed: ${error.message}`, 'error');
    console.error('Event registration error:', error);
  } finally {
    showLoadingState(false);
  }
}

/**
 * Unregister from an Event
 */
async function unregisterFromEvent(eventId) {
  try {
    if (!api.isAuthenticated()) {
      showNotification('Please login', 'warning');
      return;
    }

    showLoadingState(true);

    const response = await api.unregisterFromEvent(eventId);

    showNotification('Unregistered from event', 'success');

    // Refresh events list
    await loadAllEvents();

    return response;
  } catch (error) {
    showNotification(`Unregistration failed: ${error.message}`, 'error');
    console.error('Event unregistration error:', error);
  } finally {
    showLoadingState(false);
  }
}

/**
 * Create a New Event (Host Only)
 */
async function createNewEvent(eventData) {
  try {
    if (!api.isAuthenticated()) {
      showNotification('Please login to create events', 'warning');
      return;
    }

    showLoadingState(true);

    const response = await api.createEvent(eventData);

    showNotification('Event created successfully!', 'success');

    // Refresh events list
    await loadAllEvents();

    return response;
  } catch (error) {
    showNotification(`Failed to create event: ${error.message}`, 'error');
    console.error('Event creation error:', error);
  } finally {
    showLoadingState(false);
  }
}

// ========== UI HELPER FUNCTIONS ==========

/**
 * Update Authentication UI
 */
function updateAuthUI() {
  const authContainer = document.getElementById('authButtonsContainer');
  
  if (!authContainer) return;

  if (api.isAuthenticated()) {
    const user = api.getCurrentUser();
    authContainer.innerHTML = `
      <div class="user-menu">
        <button class="btn btn-sm" id="userMenuBtn">
          <i class="fas fa-user-circle"></i>
          ${user?.fullname?.firstname || 'User'}
        </button>
        <div class="dropdown-menu" id="userDropdown">
          <a href="#profile" class="dropdown-item">
            <i class="fas fa-user"></i> Profile
          </a>
          <a href="#events" class="dropdown-item">
            <i class="fas fa-calendar"></i> My Events
          </a>
          <button id="logoutBtn" class="dropdown-item">
            <i class="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </div>
    `;

    // Add event listeners
    document.getElementById('userMenuBtn')?.addEventListener('click', toggleUserMenu);
    document.getElementById('logoutBtn')?.addEventListener('click', () => handleUserLogout());
  } else {
    authContainer.innerHTML = `
      <button class="btn btn-outline btn-sm" id="signInBtn">
        <i class="fas fa-sign-in-alt"></i> Sign In
      </button>
      <button class="btn btn-primary btn-sm" id="signUpBtn">
        <i class="fas fa-user-plus"></i> Sign Up
      </button>
    `;

    // Add event listeners
    document.getElementById('signInBtn')?.addEventListener('click', openLoginModal);
    document.getElementById('signUpBtn')?.addEventListener('click', openSignupModal);
  }
}

/**
 * Show Loading State
 */
function showLoadingState(isLoading) {
  const loader = document.querySelector('.loading-screen');
  if (loader) {
    loader.style.display = isLoading ? 'flex' : 'none';
  }
}

/**
 * Show Notification
 */
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    color: white;
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
  `;

  document.body.appendChild(notification);

  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

/**
 * Clear Form
 */
function clearForm(formElement) {
  if (formElement instanceof HTMLElement) {
    formElement.reset();
  } else if (typeof formElement === 'object') {
    Object.keys(formElement).forEach(key => {
      formElement[key] = '';
    });
  }
}

// ========== INITIALIZATION ==========

/**
 * Initialize API Integration on Page Load
 */
document.addEventListener('DOMContentLoaded', function() {
  // Check if user is authenticated and update UI
  if (api.isAuthenticated()) {
    updateAuthUI();
    loadUserProfile();
  } else {
    updateAuthUI();
  }

  // Load events from backend instead of mock data
  loadAllEvents();

  console.log('✅ API Integration Initialized');
  console.log('Backend URL:', api.baseURL);
  console.log('Authenticated:', api.isAuthenticated());
});

// Export functions if using modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    handleUserRegistration,
    handleUserLogin,
    handleUserLogout,
    handleForgotPassword,
    handlePasswordReset,
    loadUserProfile,
    updateUserProfile,
    loadAllEvents,
    getEventDetails,
    registerForEvent,
    unregisterFromEvent,
    createNewEvent,
    updateAuthUI,
    showLoadingState,
    showNotification
  };
}
