/**
 * API Service for Frontend-Backend Integration
 * Handles all HTTP requests to the backend
 */

class APIService {
  constructor() {
    // Update this to match your backend URL
    this.baseURL = 'http://localhost:4000';
    this.token = localStorage.getItem('token');
    this.user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  }

  /**
   * Generic fetch wrapper with error handling
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add token to request if available
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle token expiration
      if (response.status === 401) {
        this.logout();
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Error: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  /**
   * Set token and user data
   */
  setAuth(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Clear authentication
   */
  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return this.user;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.token;
  }

  // ==================== USER ENDPOINTS ====================

  /**
   * User Registration
   */
  async registerUser(userData) {
    return this.request('/user/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  /**
   * User Login
   */
  async loginUser(email, password) {
    const response = await this.request('/user/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token && response.user) {
      this.setAuth(response.token, response.user);
    }
    
    return response;
  }

  /**
   * Verify User Email
   */
  async verifyUserEmail(token) {
    return this.request(`/user/verify/${token}`, {
      method: 'GET',
    });
  }

  /**
   * User Forgot Password
   */
  async userForgotPassword(email) {
    return this.request('/user/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  /**
   * User Reset Password
   */
  async userResetPassword(token, password, confirmPassword) {
    return this.request(`/user/reset-password/${token}`, {
      method: 'POST',
      body: JSON.stringify({ password, confirmPassword }),
    });
  }

  /**
   * Get User Profile
   */
  async getUserProfile() {
    return this.request('/user/profile', {
      method: 'GET',
    });
  }

  /**
   * User Logout
   */
  async userLogout() {
    try {
      await this.request('/user/logout', {
        method: 'GET',
      });
    } finally {
      this.logout();
    }
  }

  // ==================== HOST ENDPOINTS ====================

  /**
   * Host Registration
   */
  async registerHost(hostData) {
    return this.request('/host/register', {
      method: 'POST',
      body: JSON.stringify(hostData),
    });
  }

  /**
   * Host Login
   */
  async loginHost(email, password) {
    const response = await this.request('/host/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token && response.user) {
      this.setAuth(response.token, response.user);
    }
    
    return response;
  }

  /**
   * Verify Host Email
   */
  async verifyHostEmail(token) {
    return this.request(`/host/verify/${token}`, {
      method: 'GET',
    });
  }

  /**
   * Host Forgot Password
   */
  async hostForgotPassword(email) {
    return this.request('/host/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  /**
   * Host Reset Password
   */
  async hostResetPassword(token, password, confirmPassword) {
    return this.request(`/host/reset-password/${token}`, {
      method: 'POST',
      body: JSON.stringify({ password, confirmPassword }),
    });
  }

  /**
   * Get Host Profile
   */
  async getHostProfile() {
    return this.request('/host/profile', {
      method: 'GET',
    });
  }

  /**
   * Host Logout
   */
  async hostLogout() {
    try {
      await this.request('/host/logout', {
        method: 'GET',
      });
    } finally {
      this.logout();
    }
  }

  // ==================== ADMINISTRATOR ENDPOINTS ====================

  /**
   * Administrator Registration
   */
  async registerAdmin(adminData) {
    return this.request('/administrator/register', {
      method: 'POST',
      body: JSON.stringify(adminData),
    });
  }

  /**
   * Administrator Login
   */
  async loginAdmin(email, password) {
    const response = await this.request('/administrator/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token && response.user) {
      this.setAuth(response.token, response.user);
    }
    
    return response;
  }

  /**
   * Verify Admin Email
   */
  async verifyAdminEmail(token) {
    return this.request(`/administrator/verify/${token}`, {
      method: 'GET',
    });
  }

  /**
   * Admin Forgot Password
   */
  async adminForgotPassword(email) {
    return this.request('/administrator/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  /**
   * Admin Reset Password
   */
  async adminResetPassword(token, password, confirmPassword) {
    return this.request(`/administrator/reset-password/${token}`, {
      method: 'POST',
      body: JSON.stringify({ password, confirmPassword }),
    });
  }

  /**
   * Get Admin Profile
   */
  async getAdminProfile() {
    return this.request('/administrator/profile', {
      method: 'GET',
    });
  }

  /**
   * Admin Logout
   */
  async adminLogout() {
    try {
      await this.request('/administrator/logout', {
        method: 'GET',
      });
    } finally {
      this.logout();
    }
  }

  // ==================== EVENT ENDPOINTS ====================

  /**
   * Create Event
   */
  async createEvent(eventData) {
    return this.request('/event/create', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  /**
   * Get All Events
   */
  async getAllEvents(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/event/all?${params.toString()}`, {
      method: 'GET',
    });
  }

  /**
   * Get Event by ID
   */
  async getEventById(eventId) {
    return this.request(`/event/${eventId}`, {
      method: 'GET',
    });
  }

  /**
   * Update Event
   */
  async updateEvent(eventId, eventData) {
    return this.request(`/event/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  }

  /**
   * Delete Event
   */
  async deleteEvent(eventId) {
    return this.request(`/event/${eventId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Register for Event
   */
  async registerForEvent(eventId) {
    return this.request(`/event/${eventId}/register`, {
      method: 'POST',
    });
  }

  /**
   * Unregister from Event
   */
  async unregisterFromEvent(eventId) {
    return this.request(`/event/${eventId}/unregister`, {
      method: 'POST',
    });
  }

  /**
   * Get User's Events
   */
  async getUserEvents() {
    return this.request('/event/my-events', {
      method: 'GET',
    });
  }
}

// Create global instance
const api = new APIService();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = APIService;
}
