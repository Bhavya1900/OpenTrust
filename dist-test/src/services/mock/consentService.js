"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consentService = void 0;
exports.consentService = {
    /**
     * Check if a consent is currently valid (ACTIVE and not expired)
     */
    isValidConsent(consent) {
        if (!consent) {
            return { isValid: false, reason: 'Consent record does not exist.' };
        }
        if (consent.status === 'REVOKED') {
            return {
                isValid: false,
                reason: `Consent was explicitly revoked on ${new Date(consent.revokedAt || '').toLocaleString('en-IN')}.`,
            };
        }
        if (consent.status === 'DENIED') {
            return { isValid: false, reason: 'Consent was previously denied by customer.' };
        }
        if (consent.status === 'EXPIRED') {
            return {
                isValid: false,
                reason: `Consent validity expired on ${new Date(consent.expiresAt).toLocaleString('en-IN')}.`,
            };
        }
        // Check clock expiration if marked active
        const now = new Date();
        const expiry = new Date(consent.expiresAt);
        if (now > expiry) {
            return {
                isValid: false,
                reason: `Consent validity lapsed on ${expiry.toLocaleString('en-IN')}.`,
            };
        }
        if (consent.status !== 'ACTIVE') {
            return { isValid: false, reason: `Consent is in state: ${consent.status}.` };
        }
        return { isValid: true };
    },
    /**
     * Determine if specific scope is approved under an active consent
     */
    hasApprovedScope(consent, requiredScope) {
        const validity = this.isValidConsent(consent);
        if (!validity.isValid)
            return false;
        return consent.approvedScopes.includes(requiredScope);
    },
    /**
     * Calculate future expiration ISO string based on duration days
     */
    calculateExpiryDate(durationDays) {
        const d = new Date();
        d.setDate(d.getDate() + durationDays);
        return d.toISOString();
    },
    /**
     * Generate clean simulated consent ID
     */
    generateConsentId() {
        const randomHex = Math.random().toString(36).substring(2, 7);
        return `cst_${Date.now().toString(36)}_${randomHex}`;
    },
    /**
     * Create or update a consent upon customer approval
     */
    approveConsent(existingConsent, customerId, applicationId, requestedScopes, approvedScopes, durationDays) {
        const now = new Date().toISOString();
        const expiresAt = this.calculateExpiryDate(durationDays);
        return {
            id: existingConsent ? existingConsent.id : this.generateConsentId(),
            customerId,
            applicationId,
            requestedScopes,
            approvedScopes,
            status: 'ACTIVE',
            createdAt: now,
            expiresAt,
            revokedAt: undefined,
            lastAccessAt: undefined,
            durationDays,
        };
    },
    /**
     * Record customer denial
     */
    denyConsent(existingConsent, customerId, applicationId, requestedScopes) {
        const now = new Date().toISOString();
        return {
            id: existingConsent ? existingConsent.id : this.generateConsentId(),
            customerId,
            applicationId,
            requestedScopes,
            approvedScopes: [],
            status: 'DENIED',
            createdAt: now,
            expiresAt: now,
            durationDays: 0,
        };
    },
    /**
     * Revoke an active consent
     */
    revokeConsent(consent) {
        return {
            ...consent,
            status: 'REVOKED',
            revokedAt: new Date().toISOString(),
        };
    },
};
