import { Consent, ConsentScope, ConsentStatus } from '../../types';

export const consentService = {
  /**
   * Check if a consent is currently valid (ACTIVE and not expired)
   */
  isValidConsent(consent: Consent | undefined): { isValid: boolean; reason?: string } {
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
  hasApprovedScope(consent: Consent, requiredScope: ConsentScope): boolean {
    const validity = this.isValidConsent(consent);
    if (!validity.isValid) return false;
    return consent.approvedScopes.includes(requiredScope);
  },

  /**
   * Calculate future expiration ISO string based on duration days
   */
  calculateExpiryDate(durationDays: number): string {
    const d = new Date();
    d.setDate(d.getDate() + durationDays);
    return d.toISOString();
  },

  /**
   * Generate clean simulated consent ID
   */
  generateConsentId(): string {
    const randomHex = Math.random().toString(36).substring(2, 7);
    return `cst_${Date.now().toString(36)}_${randomHex}`;
  },

  /**
   * Create or update a consent upon customer approval
   */
  approveConsent(
    existingConsent: Consent | undefined,
    customerId: string,
    applicationId: string,
    requestedScopes: ConsentScope[],
    approvedScopes: ConsentScope[],
    durationDays: number
  ): Consent {
    const now = new Date().toISOString();
    const expiresAt = this.calculateExpiryDate(durationDays);

    return {
      id: existingConsent ? existingConsent.id : this.generateConsentId(),
      customerId,
      applicationId,
      requestedScopes,
      approvedScopes,
      status: 'ACTIVE' as ConsentStatus,
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
  denyConsent(
    existingConsent: Consent | undefined,
    customerId: string,
    applicationId: string,
    requestedScopes: ConsentScope[]
  ): Consent {
    const now = new Date().toISOString();
    return {
      id: existingConsent ? existingConsent.id : this.generateConsentId(),
      customerId,
      applicationId,
      requestedScopes,
      approvedScopes: [],
      status: 'DENIED' as ConsentStatus,
      createdAt: now,
      expiresAt: now,
      durationDays: 0,
    };
  },

  /**
   * Revoke an active consent
   */
  revokeConsent(consent: Consent): Consent {
    return {
      ...consent,
      status: 'REVOKED' as ConsentStatus,
      revokedAt: new Date().toISOString(),
    };
  },
};
