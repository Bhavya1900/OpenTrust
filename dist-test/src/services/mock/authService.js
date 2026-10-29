"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const seedData_1 = require("../../data/seedData");
const SESSION_STORAGE_KEY = 'opentrust_demo_session';
exports.authService = {
    /**
     * Validate demo credentials and create a simulated non-sensitive session
     */
    async login(email, password) {
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
        const session = {
            userId: seedData_1.DEMO_USER.id,
            name: seedData_1.DEMO_USER.name,
            email: seedData_1.DEMO_USER.email,
            maskedCustomerId: seedData_1.DEMO_USER.maskedCustomerId,
            loginAt: new Date().toISOString(),
            isSimulated: true,
        };
        try {
            sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
        }
        catch {
            // In private browsing or storage disabled, state can live in React memory
        }
        return {
            success: true,
            user: seedData_1.DEMO_USER,
        };
    },
    /**
     * Clear session on logout
     */
    async logout() {
        try {
            sessionStorage.removeItem(SESSION_STORAGE_KEY);
        }
        catch {
            // ignore
        }
    },
    /**
     * Retrieve active session without storing sensitive secrets
     */
    getCurrentSession() {
        try {
            const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
            if (!raw)
                return null;
            return JSON.parse(raw);
        }
        catch {
            return null;
        }
    },
    /**
     * Check if user is authenticated in the prototype
     */
    isAuthenticated() {
        return this.getCurrentSession() !== null;
    },
    /**
     * Return the full demo user details
     */
    getDemoUser() {
        return seedData_1.DEMO_USER;
    },
};
