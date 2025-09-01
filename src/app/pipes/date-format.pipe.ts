import { Pipe, PipeTransform, inject, LOCALE_ID } from '@angular/core';
import { formatDate } from '@angular/common';

// Usage examples in comments:
/*
// Basic date formatting
{{ post.publishedAt | dateFormat }}
{{ post.publishedAt | dateFormat:'short' }}
{{ post.publishedAt | dateFormat:'longDate' }}
{{ post.publishedAt | dateFormat:'MMM d, y' }}

// Relative time
{{ post.createdAt | dateFormat:'relative' }}
{{ post.createdAt | timeAgo }}

// Calendar format
{{ message.sentAt | dateFormat:'calendar' }}

// Human-readable dates
{{ post.publishedAt | humanDate }}
{{ event.startTime | humanDate:true:false }}

// Duration
{{ project.startDate | duration }}
{{ meeting.startTime | duration:meeting.endTime:'long' }}
{{ task.createdAt | duration:task.completedAt:'precise' }}

// Custom timezone and locale
{{ utcDate | dateFormat:'medium':'America/New_York':'en-US' }}

// ISO and timestamp
{{ date | dateFormat:'iso' }}
{{ date | dateFormat:'timestamp' }}
*/

export type DateFormatType =
  | 'short'
  | 'medium'
  | 'long'
  | 'full'
  | 'shortDate'
  | 'mediumDate'
  | 'longDate'
  | 'fullDate'
  | 'shortTime'
  | 'mediumTime'
  | 'longTime'
  | 'fullTime'
  | 'relative'
  | 'fromNow'
  | 'calendar'
  | 'iso'
  | 'timestamp'
  | string; // Custom format

@Pipe({
  name: 'dateFormat',
  pure: true,
})
export class DateFormatPipe implements PipeTransform {
  private locale = inject(LOCALE_ID);

  transform(
    value: Date | string | number | null | undefined,
    format: DateFormatType = 'medium',
    timezone?: string,
    locale?: string,
  ): string {
    if (!value) return '';

    try {
      const date = this.parseDate(value);
      if (!date || isNaN(date.getTime())) return '';

      const targetLocale = locale || this.locale;

      switch (format) {
        case 'relative':
        case 'fromNow':
          return this.getRelativeTime(date);

        case 'calendar':
          return this.getCalendarTime(date);

        case 'iso':
          return date.toISOString();

        case 'timestamp':
          return date.getTime().toString();

        default:
          return formatDate(date, format, targetLocale, timezone);
      }
    } catch (error) {
      console.warn('DateFormatPipe: Invalid date value', value, error);
      return '';
    }
  }

  private parseDate(value: Date | string | number): Date | null {
    if (value instanceof Date) {
      return value;
    }

    if (typeof value === 'string') {
      // Handle ISO strings, date strings, etc.
      const parsed = new Date(value);
      return isNaN(parsed.getTime()) ? null : parsed;
    }

    if (typeof value === 'number') {
      // Handle timestamps (both seconds and milliseconds)
      const timestamp = value < 10000000000 ? value * 1000 : value;
      return new Date(timestamp);
    }

    return null;
  }

  private getRelativeTime(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    // Future dates
    if (diffInSeconds < 0) {
      const absDiffInSeconds = Math.abs(diffInSeconds);
      const absDiffInMinutes = Math.abs(diffInMinutes);
      const absDiffInHours = Math.abs(diffInHours);
      const absDiffInDays = Math.abs(diffInDays);

      if (absDiffInSeconds < 60) return 'in a few seconds';
      if (absDiffInMinutes === 1) return 'in 1 minute';
      if (absDiffInMinutes < 60) return `in ${absDiffInMinutes} minutes`;
      if (absDiffInHours === 1) return 'in 1 hour';
      if (absDiffInHours < 24) return `in ${absDiffInHours} hours`;
      if (absDiffInDays === 1) return 'tomorrow';
      if (absDiffInDays < 7) return `in ${absDiffInDays} days`;
      if (absDiffInDays < 30) return `in ${Math.floor(absDiffInDays / 7)} weeks`;
      if (absDiffInDays < 365) return `in ${Math.floor(absDiffInDays / 30)} months`;
      return `in ${Math.floor(absDiffInDays / 365)} years`;
    }

    // Past dates
    if (diffInSeconds < 10) return 'just now';
    if (diffInSeconds < 60) return 'a few seconds ago';
    if (diffInMinutes === 1) return '1 minute ago';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInDays === 1) return 'yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInWeeks === 1) return '1 week ago';
    if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;
    if (diffInMonths === 1) return '1 month ago';
    if (diffInMonths < 12) return `${diffInMonths} months ago`;
    if (diffInYears === 1) return '1 year ago';
    return `${diffInYears} years ago`;
  }

  private getCalendarTime(date: Date): string {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffInDays = Math.floor((today.getTime() - dateOnly.getTime()) / (1000 * 60 * 60 * 24));

    const timeString = date.toLocaleTimeString(this.locale, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    if (diffInDays === 0) {
      return `Today at ${timeString}`;
    } else if (diffInDays === 1) {
      return `Yesterday at ${timeString}`;
    } else if (diffInDays === -1) {
      return `Tomorrow at ${timeString}`;
    } else if (diffInDays > 1 && diffInDays < 7) {
      const dayName = date.toLocaleDateString(this.locale, { weekday: 'long' });
      return `${dayName} at ${timeString}`;
    } else if (diffInDays < -1 && diffInDays > -7) {
      const dayName = date.toLocaleDateString(this.locale, { weekday: 'long' });
      return `${dayName} at ${timeString}`;
    } else {
      const dateString = date.toLocaleDateString(this.locale, {
        month: 'short',
        day: 'numeric',
        year: now.getFullYear() !== date.getFullYear() ? 'numeric' : undefined,
      });
      return `${dateString} at ${timeString}`;
    }
  }
}
