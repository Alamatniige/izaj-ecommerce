/**
 * Format currency in Philippine Peso
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format number with thousand separators
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-PH').format(num);
};

/**
 * Format date to readable string
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
};

/**
 * Format date and time to readable string
 */
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format Philippine phone numbers
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return `+63 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    return `+63 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  
  return phone; // Return original if format doesn't match
};

/**
 * Convert Supabase status to stock level for display
 */
export const getStockStatusFromStatus = (status: string | undefined): {
  level: 'in-stock' | 'low-stock' | 'out-of-stock';
  label: string;
  bgColor: string;
  textColor: string;
  dotColor: string;
} => {
  const normalizedStatus = status?.toLowerCase() || '';
  
  switch (normalizedStatus) {
    case 'in stock':
    case 'available':
    case 'active':
      return {
        level: 'in-stock',
        label: 'In Stock',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        dotColor: 'bg-green-500'
      };
    case 'low stock':
    case 'limited':
      return {
        level: 'low-stock',
        label: 'Low Stock',
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-800',
        dotColor: 'bg-orange-500'
      };
    case 'out of stock':
    case 'unavailable':
    case 'inactive':
    case 'discontinued':
      return {
        level: 'out-of-stock',
        label: 'Out of Stock',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        dotColor: 'bg-red-500'
      };
    default:
      // Default to in stock for unknown statuses
      return {
        level: 'in-stock',
        label: 'In Stock',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        dotColor: 'bg-green-500'
      };
  }
};