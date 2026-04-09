import { format, isValid } from 'date-fns';

export function formatDate(date: any, formatStr: string = 'MMM dd, yyyy'): string {
  if (!date) return '--';

  let dateObj: Date;

  // Handle Firestore Timestamp
  if (date && typeof date === 'object' && 'seconds' in date) {
    dateObj = new Date(date.seconds * 1000);
  } else if (date instanceof Date) {
    dateObj = date;
  } else {
    dateObj = new Date(date);
  }

  if (!isValid(dateObj)) {
    return '--';
  }

  return format(dateObj, formatStr);
}
