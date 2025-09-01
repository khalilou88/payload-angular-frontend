import { Pipe, PipeTransform, inject, LOCALE_ID } from '@angular/core';

@Pipe({
  name: 'duration',
  pure: true,
})
export class DurationPipe implements PipeTransform {
  transform(
    startDate: Date | string | number,
    endDate?: Date | string | number,
    format: 'short' | 'long' | 'precise' = 'short',
  ): string {
    if (!startDate) return '';

    try {
      const start = this.parseDate(startDate);
      const end = endDate ? this.parseDate(endDate) : new Date();

      if (!start || !end) return '';

      const diffInMs = Math.abs(end.getTime() - start.getTime());
      const diffInSeconds = Math.floor(diffInMs / 1000);
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);
      const diffInMonths = Math.floor(diffInDays / 30);
      const diffInYears = Math.floor(diffInDays / 365);

      switch (format) {
        case 'precise':
          return this.getPreciseDuration(diffInMs);
        case 'long':
          return this.getLongDuration(
            diffInYears,
            diffInMonths,
            diffInDays,
            diffInHours,
            diffInMinutes,
            diffInSeconds,
          );
        default:
          return this.getShortDuration(
            diffInYears,
            diffInMonths,
            diffInDays,
            diffInHours,
            diffInMinutes,
            diffInSeconds,
          );
      }
    } catch (error) {
      console.warn('DurationPipe: Invalid date values', startDate, endDate, error);
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

  private getPreciseDuration(diffInMs: number): string {
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 && days === 0) parts.push(`${seconds}s`);

    return parts.join(' ') || '0s';
  }

  private getLongDuration(
    years: number,
    months: number,
    days: number,
    hours: number,
    minutes: number,
    seconds: number,
  ): string {
    if (years > 0) return years === 1 ? '1 year' : `${years} years`;
    if (months > 0) return months === 1 ? '1 month' : `${months} months`;
    if (days > 0) return days === 1 ? '1 day' : `${days} days`;
    if (hours > 0) return hours === 1 ? '1 hour' : `${hours} hours`;
    if (minutes > 0) return minutes === 1 ? '1 minute' : `${minutes} minutes`;
    if (seconds > 0) return seconds === 1 ? '1 second' : `${seconds} seconds`;
    return 'just now';
  }

  private getShortDuration(
    years: number,
    months: number,
    days: number,
    hours: number,
    minutes: number,
    seconds: number,
  ): string {
    if (years > 0) return `${years}y`;
    if (months > 0) return `${months}mo`;
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    if (seconds > 0) return `${seconds}s`;
    return 'now';
  }
}
