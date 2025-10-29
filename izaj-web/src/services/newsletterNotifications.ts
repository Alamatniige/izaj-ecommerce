import { supabaseAdmin } from '@/lib/supabase-admin';
import { emailService } from '@/lib/email-service';

export interface NotificationOptions {
  type: 'new_products' | 'sales';
  products?: ProductInfo[];
  saleDetails?: SaleInfo;
}

export interface ProductInfo {
  name: string;
  price: number;
  imageUrl?: string;
  productUrl?: string;
  category?: string;
}

export interface SaleInfo {
  title: string;
  description: string;
  discount?: string;
  startDate?: string;
  endDate?: string;
}

export class NewsletterNotificationService {
  /**
   * Get all active subscribers
   */
  static async getActiveSubscribers(): Promise<string[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('newsletter_subscribers')
        .select('email')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching subscribers:', error);
        return [];
      }

      return data.map(sub => sub.email);
    } catch (error) {
      console.error('Error getting active subscribers:', error);
      return [];
    }
  }

  /**
   * Get subscribers based on notification preferences
   */
  static async getSubscribersByPreference(preference: 'new_products' | 'sales'): Promise<string[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('newsletter_subscribers')
        .select('email, notification_preferences')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching subscribers:', error);
        return [];
      }

      return data
        .filter(sub => {
          const prefs = sub.notification_preferences || {};
          return prefs[preference] !== false;
        })
        .map(sub => sub.email);
    } catch (error) {
      console.error('Error getting subscribers by preference:', error);
      return [];
    }
  }

  /**
   * Send email notifications to all subscribers
   */
  static async sendBulkNotification(options: NotificationOptions): Promise<{ success: number; failed: number }> {
    const emails = await this.getSubscribersByPreference(options.type);
    
    if (emails.length === 0) {
      console.log('No subscribers to notify');
      return { success: 0, failed: 0 };
    }

    let success = 0;
    let failed = 0;

    // Send emails in batches to avoid rate limits
    const batchSize = 10;
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(async (email) => {
          try {
            if (options.type === 'new_products') {
              await emailService.sendNewProductNotification(email, options.products || []);
            } else if (options.type === 'sales') {
              await emailService.sendSaleNotification(email, options.saleDetails!);
            }
            success++;
          } catch (error) {
            console.error(`Failed to send email to ${email}:`, error);
            failed++;
          }
        })
      );

      // Wait between batches to avoid rate limits
      if (i + batchSize < emails.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log(`Newsletter notification sent: ${success} success, ${failed} failed`);
    return { success, failed };
  }

  /**
   * Notify subscribers about new products
   */
  static async notifyNewProducts(products: ProductInfo[]): Promise<void> {
    if (!products || products.length === 0) {
      console.log('No products to notify about');
      return;
    }

    console.log(`Notifying subscribers about ${products.length} new product(s)`);
    await this.sendBulkNotification({
      type: 'new_products',
      products
    });
  }

  /**
   * Notify subscribers about sales/promotions
   */
  static async notifySales(saleDetails: SaleInfo): Promise<void> {
    console.log('Notifying subscribers about sale:', saleDetails.title);
    await this.sendBulkNotification({
      type: 'sales',
      saleDetails
    });
  }
}

