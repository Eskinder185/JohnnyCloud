// Date utility functions for consistent timestamp handling

/**
 * Safely formats a timestamp to a localized time string
 * Handles both Date objects and string timestamps
 */
export function formatTimestamp(timestamp: Date | string | number): string {
  try {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    return date.toLocaleTimeString();
  } catch (error) {
    console.warn('Error formatting timestamp:', error);
    return 'Invalid date';
  }
}

/**
 * Safely formats a timestamp to a localized date and time string
 * Handles both Date objects and string timestamps
 */
export function formatDateTime(timestamp: Date | string | number): string {
  try {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    return date.toLocaleString();
  } catch (error) {
    console.warn('Error formatting date/time:', error);
    return 'Invalid date';
  }
}

/**
 * Safely formats a timestamp to a localized date string
 * Handles both Date objects and string timestamps
 */
export function formatDate(timestamp: Date | string | number): string {
  try {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    return date.toLocaleDateString();
  } catch (error) {
    console.warn('Error formatting date:', error);
    return 'Invalid date';
  }
}

/**
 * Converts a timestamp to a Date object safely
 * Handles both Date objects and string timestamps
 */
export function toDate(timestamp: Date | string | number): Date {
  if (timestamp instanceof Date) {
    return timestamp;
  }
  
  const date = new Date(timestamp);
  
  if (isNaN(date.getTime())) {
    console.warn('Invalid timestamp provided:', timestamp);
    return new Date(); // Return current date as fallback
  }
  
  return date;
}
