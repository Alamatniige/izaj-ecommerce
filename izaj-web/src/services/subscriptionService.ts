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
   * Subscribes user to newsletter
   */
  static async subscribe(email: string): Promise<SubscriptionResult> {
    try {
      // For now, we'll simulate a successful subscription
      // In a real implementation, this would make an API call to your backend
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email is already subscribed (simulate)
      const existingSubscriptions = this.getStoredSubscriptions();
      if (existingSubscriptions.includes(email)) {
        return {
          success: false,
          error: 'This email is already subscribed to our newsletter.'
        };
      }

      // Store subscription locally (in a real app, this would be sent to your backend)
      this.storeSubscription(email);

      return {
        success: true,
        message: 'Welcome to the IZAJ Family! You are now subscribed to our newsletter.'
      };
    } catch (error) {
      console.error('Subscription error:', error);
      return {
        success: false,
        error: 'Failed to subscribe. Please try again later.'
      };
    }
  }

  /**
   * Gets stored subscriptions from localStorage (for demo purposes)
   */
  private static getStoredSubscriptions(): string[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem('izaj_subscriptions');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading stored subscriptions:', error);
      return [];
    }
  }

  /**
   * Stores subscription in localStorage (for demo purposes)
   */
  private static storeSubscription(email: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const existing = this.getStoredSubscriptions();
      const updated = [...existing, email];
      localStorage.setItem('izaj_subscriptions', JSON.stringify(updated));
    } catch (error) {
      console.error('Error storing subscription:', error);
    }
  }

  /**
   * Unsubscribes user from newsletter
   */
  static async unsubscribe(email: string): Promise<SubscriptionResult> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const existingSubscriptions = this.getStoredSubscriptions();
      const updatedSubscriptions = existingSubscriptions.filter(sub => sub !== email);
      
      if (existingSubscriptions.length === updatedSubscriptions.length) {
        return {
          success: false,
          error: 'Email not found in our subscription list.'
        };
      }

      // Update stored subscriptions
      if (typeof window !== 'undefined') {
        localStorage.setItem('izaj_subscriptions', JSON.stringify(updatedSubscriptions));
      }

      return {
        success: true,
        message: 'You have been successfully unsubscribed from our newsletter.'
      };
    } catch (error) {
      console.error('Unsubscription error:', error);
      return {
        success: false,
        error: 'Failed to unsubscribe. Please try again later.'
      };
    }
  }

  /**
   * Checks if email is subscribed
   */
  static isSubscribed(email: string): boolean {
    const normalizedEmail = this.normalizeEmail(email);
    const subscriptions = this.getStoredSubscriptions();
    return subscriptions.includes(normalizedEmail);
  }
}
