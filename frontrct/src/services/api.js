/**
 * API Service with JWT Refresh Token Support
 */

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

class APIService {
  constructor() {
    this.baseURL = baseURL;
    this.accessToken = null;
    this.user = null;
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  /* ================= QUEUE HANDLING ================= */
  processQueue(error, token = null) {
    this.failedQueue.forEach(prom => {
      if (error) prom.reject(error);
      else prom.resolve(token);
    });
    this.failedQueue = [];
  }

  /* ================= CORE REQUEST ================= */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
      // Show first 20 chars and last 20 chars of token for debugging
      const tokenPreview = `${this.accessToken.substring(0, 20)}...${this.accessToken.substring(this.accessToken.length - 20)}`;
      console.log('[API] Sending request with Authorization header');
      console.log('   - Endpoint:', endpoint);
      console.log('   - Token preview:', tokenPreview);
    } else {
      console.warn('[API] No access token available for request to', endpoint);
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', // 🔥 important for refresh token cookie
      });

      if (response.status === 401 && !endpoint.includes('/refresh-token')) {
        return this.handle401(endpoint, options);
      }

      const data = response.status !== 204 ? await response.json() : null;

      console.log(`[API] Response received from ${endpoint}:`, {
        status: response.status,
        hasAccessToken: data?.accessToken ? true : false,
        tokenLength: data?.accessToken ? data.accessToken.length : 0,
        hasUser: data?.user ? true : false
      });

      if (!response.ok) {
        const err = new Error(data?.message || 'Request failed');
        err.status = response.status;
        throw err;
      }

      return data;
    } catch (err) {
      console.error('API Error:', err);
      throw err;
    }
  }

  /* ================= 401 HANDLER ================= */
  async handle401(endpoint, options) {
    // Don't try to refresh the refresh-token endpoint itself - that would cause infinite loops
    if (endpoint.includes('/refresh-token')) {
      console.error('[API] Refresh token endpoint returned 401 - session is invalid');
      this.clearAuth();
      localStorage.removeItem('userRole');
      window.location.href = '/login';
      throw new Error('Session expired');
    }

    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      }).then(() => this.request(endpoint, options));
    }

    this.isRefreshing = true;

    try {
      const storedRole = localStorage.getItem('userRole') || 'user';
      console.log('[API] Attempting to refresh token for role:', storedRole);
      
      // For now, host tokens don't refresh - if they expire, user must re-login
      // This is temporary until we implement refresh properly
      console.error('[API] Host session expired - token lifetime exceeded');
      this.clearAuth();
      localStorage.removeItem('userRole');
      window.location.href = '/login';
      throw new Error('Your session has expired. Please log in again.');
      
      console.log('   - Refresh response data:', {
        hasAccessToken: !!data.accessToken,
        hasUser: !!data.user,
        accessTokenLength: data.accessToken ? data.accessToken.length : 0
      });
      
      this.setAuth(data.accessToken, data.user);
      
      console.log('   - After setAuth():');
      console.log('     - this.accessToken length:', this.accessToken ? this.accessToken.length : 'null');
      console.log('     - Token preview:', this.accessToken ? `${this.accessToken.substring(0, 20)}...` : 'null');
      
      console.log('[API] Token refreshed successfully');
      this.processQueue(null, data.accessToken);
      return this.request(endpoint, options);
    } catch (err) {
      console.error('[API] Token refresh failed:', err.message);
      this.processQueue(err, null);
      this.clearAuth();
      localStorage.removeItem('userRole');
      window.location.href = '/login';
      throw err;
    } finally {
      this.isRefreshing = false;
    }
  }

  /* ================= AUTH HELPERS ================= */
  setAuth(accessToken, user = null) {
    console.log('[API] setAuth() called with:');
    console.log('   - accessToken provided:', !!accessToken);
    console.log('   - accessToken length:', accessToken ? accessToken.length : 'N/A');
    console.log('   - user provided:', !!user);
    
    this.accessToken = accessToken;
    if (user) this.user = user;
    
    console.log('   - After assignment - this.accessToken length:', this.accessToken ? this.accessToken.length : 'null');
  }

  clearAuth() {
    this.accessToken = null;
    this.user = null;
  }

  /* ================= REFRESH TOKEN ================= */
  async refreshToken(role = 'user') {
    const roleMap = {
      'user': '/api/users/refresh-token',
      'admin': '/api/administrators/refresh-token',
      'administrator': '/api/administrators/refresh-token',
      'host': '/api/hosts/refresh-token'
    };
    
    const endpoint = roleMap[role] || roleMap['user'];
    
    try {
      console.log('[API] Calling refresh endpoint:', endpoint);
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('   - Response status:', response.status);
      console.log('   - Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('   - Error response:', errorData);
        throw new Error(errorData.message || 'Session expired');
      }

      const data = await response.json();
      console.log('   - Refresh response received');
      console.log('   - Has accessToken:', !!data.accessToken);
      console.log('   - Has user:', !!data.user);
      if (data.accessToken) {
        const tokenPreview = `${data.accessToken.substring(0, 20)}...${data.accessToken.substring(data.accessToken.length - 20)}`;
        console.log('   - Token preview:', tokenPreview);
      }
      return data;
    } catch (err) {
      console.error('[API] Refresh token error:', err.message);
      throw err;
    }
  }

  /* ================= USER AUTH ================= */
  loginUser(email, password) {
    return this.request('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  registerUser(data) {
    return this.request('/api/users/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  logout() {
    this.clearAuth();
    return fetch(`${this.baseURL}/api/users/logout`, {
      method: 'GET',
      credentials: 'include',
    });
  }

  /* ================= HOST ================= */
  loginHost(email, password) {
    console.log('📱 loginHost() called with email:', email);
    console.log('   - Current this.accessToken:', this.accessToken ? `${this.accessToken.substring(0, 20)}...` : 'null');
    return this.request('/api/hosts/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  registerHost(data) {
    return this.request('/api/hosts/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /* ================= ADMIN ================= */
  loginAdministrator(email, password) {
    return this.request('/api/administrators/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  registerAdministrator(data) {
    return this.request('/api/administrators/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /* ================= PROFILE ================= */
  getUserProfile() {
    return this.request('/api/users/profile');
  }

  updateUserProfile(data) {
    return this.request('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  getHostProfile() {
    return this.request('/api/hosts/profile');
  }

  updateHostProfile(data) {
    return this.request('/api/hosts/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  getAdminProfile() {
    return this.request('/api/administrators/profile');
  }

  updateAdminProfile(data) {
    return this.request('/api/administrators/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /* ================= EVENTS ================= */
  getEvents(filters = {}) {
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/events?${queryString}` : '/api/events';
    
    return this.request(endpoint);
  }

  getEventById(eventId) {
    return this.request(`/api/events/${eventId}`);
  }

  createEvent(eventData) {
    // Map frontend field names to backend field names
    // Support both old (title, date, time, maxParticipants) and new (eventName, eventDate, eventTime, capacity) field names
    const mappedData = {
      eventName: eventData.eventName || eventData.title,
      description: eventData.description,
      eventDate: eventData.eventDate || eventData.date,
      eventTime: eventData.eventTime || eventData.time,
      meetingLink: eventData.meetingLink,
      category: eventData.category,
      capacity: eventData.capacity || eventData.maxParticipants
    };
    
    return this.request('/api/events', {
      method: 'POST',
      body: JSON.stringify(mappedData),
    });
  }

  // Alias for backward compatibility
  createConference(eventData) {
    return this.createEvent(eventData);
  }

  updateEvent(eventId, eventData) {
    return this.request(`/api/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  }

  deleteEvent(eventId) {
    return this.request(`/api/events/${eventId}`, {
      method: 'DELETE',
    });
  }

  registerForEvent(eventId) {
    return this.request('/api/events/register', {
      method: 'POST',
      body: JSON.stringify({ eventId }),
    });
  }

  unregisterFromEvent(eventId) {
    return this.request('/api/events/unregister', {
      method: 'POST',
      body: JSON.stringify({ eventId }),
    });
  }

  getPendingEvents() {
    return this.request('/api/events/pending');
  }

  updateEventStatus(eventId, status, rejectionReason = null) {
    const body = { status };
    if (rejectionReason && status === 'rejected') {
      body.rejectionReason = rejectionReason;
    }
    
    return this.request(`/api/events/${eventId}/status`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  getHostEvents() {
    return this.request('/api/events/host-events');
  }

  forgotPassword(email, role = 'user') {
    const endpoint = role === 'admin' ? '/api/administrators/forgot-password' 
                   : role === 'host' ? '/api/hosts/forgot-password'
                   : '/api/users/forgot-password';
    
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  resetPassword(token, password, confirmPassword, role = 'user') {
    const endpoint = role === 'admin' ? `/api/administrators/reset-password/${token}`
                   : role === 'host' ? `/api/hosts/reset-password/${token}`
                   : `/api/users/reset-password/${token}`;
    
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify({ password, confirmPassword }),
    });
  }
}

export default new APIService();
