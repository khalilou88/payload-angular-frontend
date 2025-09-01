import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 100, completeWords = true, ellipsis = '...'): string {
    if (!value || value.length <= limit) {
      return value;
    }

    if (completeWords) {
      const words = value.substr(0, limit).split(' ');
      words.pop(); // Remove last incomplete word
      return words.join(' ') + ellipsis;
    }

    return value.substr(0, limit) + ellipsis;
  }
}
