export interface SubscriptionResult {
  success: boolean;
  message?: string;
  error?: string;
}

export class SubscriptionService {
  /**
   * Validates email format
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Normalizes email by converting to lowercase and trimming whitespace
   */
  static normalizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  /**
   * Subscribes user to newsletter via API
   */
  static async subscribe(email: string): Promise<SubscriptionResult> {
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Subscription error:', error);
      return {
        success: false,
        error: 'Failed to subscribe. Please try again later.'
      };
    }
  }

  /**
   * Unsubscribes user from newsletter via API
   */
  static async unsubscribe(email: string): Promise<SubscriptionResult> {
    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Unsubscription error:', error);
      return {
        success: false,
        error: 'Failed to unsubscribe. Please try again later.'
      };
    }
  }

  /**
   * Checks if email is subscribed (via API)
   */
  static async isSubscribed(email: string): Promise<boolean> {
    try {
      const normalizedEmail = this.normalizeEmail(email);
      const response = await fetch(`/api/subscribe/check?email=${encodeURIComponent(normalizedEmail)}`);
      const data = await response.json();
      return data.isSubscribed || false;
    } catch (error) {
      console.error('Check subscription error:', error);
      return false;
    }
  }
}
