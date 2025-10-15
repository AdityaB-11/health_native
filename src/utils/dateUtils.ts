import { Timestamp } from 'firebase/firestore';

/**
 * Format a Firestore Timestamp or Date string to a readable format
 * @param date - Firestore Timestamp, Date object, or ISO string
 * @returns Formatted date string (e.g., "Oct 15, 2024")
 */
export const formatDate = (date: any): string => {
  try {
    let jsDate: Date;

    // Handle Firestore Timestamp
    if (date && typeof date === 'object' && 'seconds' in date) {
      jsDate = new Date(date.seconds * 1000);
    }
    // Handle Date object
    else if (date instanceof Date) {
      jsDate = date;
    }
    // Handle ISO string or other string formats
    else if (typeof date === 'string') {
      jsDate = new Date(date);
    }
    // Fallback to current date
    else {
      jsDate = new Date();
    }

    // Check if date is valid
    if (isNaN(jsDate.getTime())) {
      return 'Invalid date';
    }

    // Format as "Oct 15, 2024"
    return jsDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

/**
 * Format a date to relative time (e.g., "2 days ago", "Just now")
 * @param date - Firestore Timestamp, Date object, or ISO string
 * @returns Relative time string
 */
export const formatRelativeTime = (date: any): string => {
  try {
    let jsDate: Date;

    if (date && typeof date === 'object' && 'seconds' in date) {
      jsDate = new Date(date.seconds * 1000);
    } else if (date instanceof Date) {
      jsDate = date;
    } else if (typeof date === 'string') {
      jsDate = new Date(date);
    } else {
      return 'Unknown';
    }

    const now = new Date();
    const diffMs = now.getTime() - jsDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
    
    return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`;
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Unknown';
  }
};

/**
 * Format time in 12-hour format (e.g., "2:30 PM")
 * @param time - Time string in "HH:MM AM/PM" format or 24-hour "HH:MM"
 * @returns Formatted time string
 */
export const formatTime = (time: string): string => {
  try {
    // If already in 12-hour format, return as is
    if (time.includes('AM') || time.includes('PM')) {
      return time;
    }

    // Convert 24-hour to 12-hour format
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  } catch (error) {
    return time;
  }
};

/**
 * Format date and time together
 * @param date - Date value
 * @param time - Time string
 * @returns Combined date and time string
 */
export const formatDateTime = (date: any, time?: string): string => {
  const formattedDate = formatDate(date);
  if (time) {
    return `${formattedDate} at ${formatTime(time)}`;
  }
  return formattedDate;
};
