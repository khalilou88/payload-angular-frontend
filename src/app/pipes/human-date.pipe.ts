import { inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'humanDate',
  standalone: true,
  pure: true,
})
export class HumanDatePipe implements PipeTransform {
  private locale = inject(LOCALE_ID);

  transform(
    value: Date | string | number | null | undefined,
    includeTime: boolean = false,
    shortFormat: boolean = false,
  ): string {
    if (!value) return '';

    try {
      const date = this.parseDate(value);
      if (!date || isNaN(date.getTime())) return '';

      const now = new Date();
      const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

      // Today
      if (diffInDays === 0) {
        if (includeTime) {
          const timeString = date.toLocaleTimeString(this.locale, {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          });
          return `Today, ${timeString}`;
        }
        return 'Today';
      }

      // Yesterday
      if (diffInDays === 1) {
        if (includeTime) {
          const timeString = date.toLocaleTimeString(this.locale, {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          });
          return `Yesterday, ${timeString}`;
        }
        return 'Yesterday';
      }

      // Tomorrow
      if (diffInDays === -1) {
        if (includeTime) {
          const timeString = date.toLocaleTimeString(this.locale, {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          });
          return `Tomorrow, ${timeString}`;
        }
        return 'Tomorrow';
      }

      // This week (past)
      if (diffInDays > 1 && diffInDays < 7) {
        const dayName = date.toLocaleDateString(this.locale, {
          weekday: shortFormat ? 'short' : 'long',
        });
        if (includeTime) {
          const timeString = date.toLocaleTimeString(this.locale, {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          });
          return `${dayName}, ${timeString}`;
        }
        return dayName;
      }

      // Next week (future)
      if (diffInDays < -1 && diffInDays > -7) {
        const dayName = date.toLocaleDateString(this.locale, {
          weekday: shortFormat ? 'short' : 'long',
        });
        if (includeTime) {
          const timeString = date.toLocaleTimeString(this.locale, {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          });
          return `${dayName}, ${timeString}`;
        }
        return dayName;
      }

      // Older dates
      const options: Intl.DateTimeFormatOptions = {
        month: shortFormat ? 'short' : 'long',
        day: 'numeric',
        year: now.getFullYear() !== date.getFullYear() ? 'numeric' : undefined,
      };

      if (includeTime) {
        options.hour = 'numeric';
        options.minute = '2-digit';
        options.hour12 = true;
      }

      return date.toLocaleDateString(this.locale, options);
    } catch (error) {
      console.warn('HumanDatePipe: Invalid date value', value, error);
      return '';
    }
  }

  private parseDate(value: Date | string | number): Date | null {
    if (value instanceof Date) return value;
    if (typeof value === 'string') return new Date(value);
    if (typeof value === 'number') {
      const timestamp = value < 10000000000 ? value * 1000 : value;
      return new Date(timestamp);
    }
    return null;
  }
}
