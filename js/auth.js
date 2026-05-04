/* ============================================================
   auth.js — AuthService
   Mock authentication. Credentials are hardcoded in data.js
   (SEED_USERS). Session is held in sessionStorage so it clears
   when the browser closes — a sensible default for a public-
   library workstation. Demo only — never use this pattern for
   real authentication.
   ============================================================ */

(function () {
  'use strict';

  const SESSION_KEY = 'meridian.library.session.v1';

  /* Look up a user by credentials. Returns the user (without
     password) on success, or null on failure. */
  function authenticate(username, password) {
    const user = (window.SEED_USERS || []).find(
      u => u.username === username && u.password === password
    );
    if (!user) return null;
    // Strip password before returning — the session must never
    // hold the credential.
    const { password: _pw, ...safeUser } = user;
    return safeUser;
  }

  const AuthService = {
    /* Try to sign in. Returns the user object on success, null otherwise. */
    login(username, password) {
      const user = authenticate(username, password);
      if (!user) return null;
      try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
      } catch (err) {
        console.warn('AuthService: could not write session.', err);
      }
      return user;
    },

    /* Clear the session. */
    logout() {
      try {
        sessionStorage.removeItem(SESSION_KEY);
      } catch (err) { /* ignore */ }
    },

    /* The currently signed-in user, or null if no session. */
    current() {
      try {
        const raw = sessionStorage.getItem(SESSION_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (err) {
        return null;
      }
    },

    /* Convenience: is the current user an admin? */
    isAdmin() {
      const u = this.current();
      return !!u && u.role === 'admin';
    },

    /* Redirect to login page if not signed in.
       Pass the current page so we can return after auth. */
    requireAuth() {
      if (!this.current()) {
        const redirect = encodeURIComponent(
          window.location.pathname + window.location.search
        );
        window.location.href = 'login.html?redirect=' + redirect;
      }
    },

    /* Redirect to dashboard if not an admin. Used by admin-only views. */
    requireAdmin() {
      this.requireAuth();
      if (!this.isAdmin()) {
        window.location.href = 'index.html';
      }
    }
  };

  window.AuthService = AuthService;
})();
