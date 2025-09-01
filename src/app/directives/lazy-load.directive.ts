import { Directive, ElementRef, OnInit, inject, PLATFORM_ID, input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appLazyLoad]',
})
export class LazyLoadDirective implements OnInit {
  readonly appLazyLoad = input.required<string>();
  readonly placeholder = input(
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23f3f4f6' viewBox='0 0 100 100'%3E%3Crect width='100' height='100'/%3E%3C/svg%3E",
  );

  private el = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const img = this.el.nativeElement;
    img.src = this.placeholder();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          img.src = this.appLazyLoad();
          observer.unobserve(img);
        }
      });
    });

    observer.observe(img);
  }
}
