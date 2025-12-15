// Authentication System for Laundry Cat POS
const Auth = {
    // Default credentials (should be changed after first login)
    credentials: {
        username: 'admin',
        password: 'laundrycat2024' // CHANGE THIS PASSWORD!
    },
    // Session configuration
    sessionKey: 'laundry_cat_session',
    sessionDuration: 8 * 60 * 60 * 1000, // 8 hours in milliseconds
    // Login function
    login: function(username, password) {
        if (username === this.credentials.username && password === this.credentials.password) {
            const session = {
                user: username,
                timestamp: Date.now(),
                expiresAt: Date.now() + this.sessionDuration
            };
            localStorage.setItem(this.sessionKey, JSON.stringify(session));
            return true;
        }
        return false;
    },
    // Logout function
    logout: function() {
        localStorage.removeItem(this.sessionKey);
        window.location.href = 'login.html';
    },
    // Check if user is authenticated
    isAuthenticated: function() {
        const sessionStr = localStorage.getItem(this.sessionKey);
        if (!sessionStr) return false;
        try {
            const session = JSON.parse(sessionStr);
            
            // Check if session has expired
            if (Date.now() > session.expiresAt) {
                this.logout();
                return false;
            }
            return true;
        } catch (e) {
            return false;
        }
    },
    // Get current user
    getCurrentUser: function() {
        const sessionStr = localStorage.getItem(this.sessionKey);
        if (!sessionStr) return null;
        try {
            return JSON.parse(sessionStr).user;
        } catch (e) {
            return null;
        }
    },
    // Change password (helper for console use)
    changePassword: function(oldPassword, newPassword) {
        if (oldPassword === this.credentials.password) {
            this.credentials.password = newPassword;
            console.log('✅ Password changed successfully!');
            return true;
        } else {
            console.error('❌ Incorrect old password');
            return false;
        }
    }
};
// Expose to window
window.Auth = Auth;
