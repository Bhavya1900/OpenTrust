import { User } from '../../types';
import { DEMO_USER } from '../../data/seedData';

const SESSION_STORAGE_KEY = 'opentrust_demo_session';

export interface AuthSession {
  userId: string;
  name: string;
  email: string;
  maskedCustomerId: string;
  loginAt: string;
  isSimulated: boolean;
}

export const authService = {
  /**
   * Validate demo credentials and create a simulated non-sensitive session
   */
  async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    // Simulate brief network latency for realistic feel
    await new Promise((resolve) => setTimeout(resolve, 350));

    const trimmedEmail = email.trim().toLowerCase();

    // Verify against documented fictitious prototype credentials
    if (trimmedEmail !== 'demo@opentrust.test' || password !== 'Demo@123') {
      return {
        success: false,
        error: 'Invalid credentials. Please use the documented demo account (demo@opentrust.test / Demo@123).',
      };
    }

    const session: AuthSession = {
      userId: DEMO_USER.id,
      name: DEMO_USER.name,
      email: DEMO_USER.email,
      maskedCustomerId: DEMO_USER.maskedCustomerId,
      loginAt: new Date().toISOString(),
      isSimulated: true,
    };

    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch {
      // In private browsing or storage disabled, state can live in React memory
    }

    return {
      success: true,
      user: DEMO_USER,
    };
  },

  /**
   * Clear session on logout
   */
  async logout(): Promise<void> {
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // ignore
    }
  },

  /**
   * Retrieve active session without storing sensitive secrets
   */
  getCurrentSession(): AuthSession | null {
    try {
      const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as AuthSession;
    } catch {
      return null;
    }
  },

  /**
   * Check if user is authenticated in the prototype
   */
  isAuthenticated(): boolean {
    return this.getCurrentSession() !== null;
  },

  /**
   * Return the full demo user details
   */
  getDemoUser(): User {
    return DEMO_USER;
  },
};
