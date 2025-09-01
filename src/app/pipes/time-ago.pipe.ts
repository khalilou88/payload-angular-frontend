import { Pipe, PipeTransform, inject, LOCALE_ID } from '@angular/core';
import { formatDate } from '@angular/common';
import { DateFormatPipe } from './date-format.pipe';

// Additional specialized pipes
@Pipe({
  name: 'timeAgo',
  pure: true,
})
export class TimeAgoPipe implements PipeTransform {
  private dateFormatPipe = new DateFormatPipe();

  transform(value: Date | string | number | null | undefined): string {
    return this.dateFormatPipe.transform(value, 'relative');
  }
}
