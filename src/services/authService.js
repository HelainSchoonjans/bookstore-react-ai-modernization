/**
 * Mock authentication service that mimics the BasicAccessControl from the Vaadin app.
 * Accepts any username where the password equals the username.
 * Only "admin" user has admin role.
 */
class AuthService {
  constructor() {
    this.currentUser = null;
  }

  /**
   * Sign in with username and password
   * @param {string} username 
   * @param {string} password 
   * @returns {boolean} true if sign in successful
   */
  signIn(username, password) {
    if (!username || username.trim() === '') {
      return false;
    }

    if (username !== password) {
      return false;
    }

    // Simulate session change
    this.currentUser = username;
    localStorage.setItem('currentUser', username);
    return true;
  }

  /**
   * Check if user is signed in
   * @returns {boolean} true if user is signed in
   */
  isUserSignedIn() {
    return this.getCurrentUser() !== null;
  }

  /**
   * Check if current user is in the specified role
   * @param {string} role 
   * @returns {boolean} true if user is in role
   */
  isUserInRole(role) {
    if (role === 'admin') {
      // Only the "admin" user is in the "admin" role
      return this.getPrincipalName() === 'admin';
    }

    // All users are in all non-admin roles
    return true;
  }

  /**
   * Get the current user's principal name
   * @returns {string} current username or empty string
   */
  getPrincipalName() {
    return this.getCurrentUser() || '';
  }

  /**
   * Sign out the current user
   */
  signOut() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  /**
   * Get current user from localStorage or memory
   * @returns {string|null} current username or null
   */
  getCurrentUser() {
    if (this.currentUser) {
      return this.currentUser;
    }
    
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      this.currentUser = stored;
      return stored;
    }
    
    return null;
  }
}

export default new AuthService();
