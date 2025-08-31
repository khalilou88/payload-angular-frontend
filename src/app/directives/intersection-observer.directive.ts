import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  OnDestroy,
  Output,
  inject,
  PLATFORM_ID,
  NgZone,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface IntersectionStatus {
  isIntersecting: boolean;
  entry: IntersectionObserverEntry;
  target: Element;
}

// Usage examples in comments:
/*
// Basic intersection observer
<div appIntersectionObserver
     [threshold]="0.5"
     [triggerOnce]="true"
     (intersecting)="onElementVisible($event)"
     (notIntersecting)="onElementHidden($event)">
  Content to observe
</div>

// Visibility tracker
<section appVisibilityTracker
         [visibilityThreshold]="0.7"
         [trackOnce]="false"
         (visible)="onSectionVisible($event)"
         (visibilityChange)="onVisibilityChange($event)">
  Track when this section is visible
</section>

// Scroll animation
<div appScrollAnimation
     animationClass="animate-slide-in"
     [animationDelay]="200"
     [animationThreshold]="0.2"
     [animateOnce]="true">
  This will animate when scrolled into view
</div>

// Multiple thresholds for granular control
<div appIntersectionObserver
     [threshold]="[0, 0.25, 0.5, 0.75, 1]"
     (statusChange)="onIntersectionChange($event)">
  Fine-grained intersection tracking
</div>

// Custom root element
<div #scrollContainer class="overflow-auto h-64">
  <div appIntersectionObserver
       [root]="scrollContainer"
       [rootMargin]="'20px'"
       (intersecting)="onVisible()">
    Content within custom scroll container
  </div>
</div>
*/

@Directive({
  selector: '[appIntersectionObserver]',
  standalone: true,
})
export class IntersectionObserverDirective implements OnInit, OnDestroy {
  @Input() root: Element | null = null;
  @Input() rootMargin = '0px';
  @Input() threshold: number | number[] = 0;
  @Input() triggerOnce = false;
  @Input() disabled = false;

  @Output() intersecting = new EventEmitter<IntersectionStatus>();
  @Output() notIntersecting = new EventEmitter<IntersectionStatus>();
  @Output() statusChange = new EventEmitter<IntersectionStatus>();

  private elementRef = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);
  private ngZone = inject(NgZone);

  private observer: IntersectionObserver | null = null;
  private hasTriggered = false;

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId) || this.disabled) {
      return;
    }

    this.createObserver();
    this.startObserving();
  }

  ngOnDestroy() {
    this.stopObserving();
  }

  private createObserver() {
    if (!isPlatformBrowser(this.platformId)) return;

    const options: IntersectionObserverInit = {
      root: this.root,
      rootMargin: this.rootMargin,
      threshold: this.threshold,
    };

    this.observer = new IntersectionObserver((entries) => {
      this.ngZone.run(() => {
        this.handleIntersection(entries);
      });
    }, options);
  }

  private startObserving() {
    if (this.observer && this.elementRef.nativeElement) {
      this.observer.observe(this.elementRef.nativeElement);
    }
  }

  private stopObserving() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  private handleIntersection(entries: IntersectionObserverEntry[]) {
    entries.forEach((entry) => {
      const status: IntersectionStatus = {
        isIntersecting: entry.isIntersecting,
        entry,
        target: entry.target,
      };

      // Emit status change event
      this.statusChange.emit(status);

      // Emit specific intersection events
      if (entry.isIntersecting) {
        this.intersecting.emit(status);
        this.hasTriggered = true;

        // Stop observing if triggerOnce is true
        if (this.triggerOnce) {
          this.stopObserving();
        }
      } else {
        this.notIntersecting.emit(status);
      }
    });
  }

  // Public methods for external control
  public startObserving$() {
    if (!this.observer && !this.disabled) {
      this.createObserver();
    }
    this.startObserving();
  }

  public stopObserving$() {
    this.stopObserving();
  }

  public reset() {
    this.hasTriggered = false;
    this.stopObserving();
    if (!this.disabled) {
      this.createObserver();
      this.startObserving();
    }
  }
}

// Additional utility directive for common use cases
@Directive({
  selector: '[appVisibilityTracker]',
  standalone: true,
})
export class VisibilityTrackerDirective implements OnInit, OnDestroy {
  @Input() visibilityThreshold = 0.5;
  @Input() trackOnce = false;
  @Input() rootMargin = '0px';

  @Output() visible = new EventEmitter<Element>();
  @Output() hidden = new EventEmitter<Element>();
  @Output() visibilityChange = new EventEmitter<{
    element: Element;
    isVisible: boolean;
    ratio: number;
  }>();

  private elementRef = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);
  private ngZone = inject(NgZone);

  private observer: IntersectionObserver | null = null;
  private isCurrentlyVisible = false;

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.createVisibilityObserver();
    this.startTracking();
  }

  ngOnDestroy() {
    this.stopTracking();
  }

  private createVisibilityObserver() {
    const options: IntersectionObserverInit = {
      rootMargin: this.rootMargin,
      threshold: [0, this.visibilityThreshold, 1],
    };

    this.observer = new IntersectionObserver((entries) => {
      this.ngZone.run(() => {
        this.handleVisibilityChange(entries);
      });
    }, options);
  }

  private startTracking() {
    if (this.observer && this.elementRef.nativeElement) {
      this.observer.observe(this.elementRef.nativeElement);
    }
  }

  private stopTracking() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  private handleVisibilityChange(entries: IntersectionObserverEntry[]) {
    entries.forEach((entry) => {
      const isVisible = entry.intersectionRatio >= this.visibilityThreshold;
      const element = entry.target;

      // Only emit if visibility actually changed
      if (isVisible !== this.isCurrentlyVisible) {
        this.isCurrentlyVisible = isVisible;

        this.visibilityChange.emit({
          element,
          isVisible,
          ratio: entry.intersectionRatio,
        });

        if (isVisible) {
          this.visible.emit(element);

          if (this.trackOnce) {
            this.stopTracking();
          }
        } else {
          this.hidden.emit(element);
        }
      }
    });
  }
}

// Directive for scroll-triggered animations
@Directive({
  selector: '[appScrollAnimation]',
  standalone: true,
})
export class ScrollAnimationDirective implements OnInit, OnDestroy {
  @Input() animationClass = 'animate-fade-in-up';
  @Input() animationDelay = 0;
  @Input() animationThreshold = 0.1;
  @Input() animateOnce = true;

  private elementRef = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);
  private ngZone = inject(NgZone);

  private observer: IntersectionObserver | null = null;
  private hasAnimated = false;

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Initially hide the element
    this.elementRef.nativeElement.style.opacity = '0';
    this.elementRef.nativeElement.style.transform = 'translateY(20px)';

    this.createAnimationObserver();
    this.startObserving();
  }

  ngOnDestroy() {
    this.stopObserving();
  }

  private createAnimationObserver() {
    const options: IntersectionObserverInit = {
      threshold: this.animationThreshold,
      rootMargin: '0px 0px -50px 0px', // Trigger slightly before element enters viewport
    };

    this.observer = new IntersectionObserver((entries) => {
      this.ngZone.run(() => {
        this.handleAnimation(entries);
      });
    }, options);
  }

  private startObserving() {
    if (this.observer && this.elementRef.nativeElement) {
      this.observer.observe(this.elementRef.nativeElement);
    }
  }

  private stopObserving() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  private handleAnimation(entries: IntersectionObserverEntry[]) {
    entries.forEach((entry) => {
      if (entry.isIntersecting && (!this.hasAnimated || !this.animateOnce)) {
        this.triggerAnimation(entry.target as HTMLElement);
        this.hasAnimated = true;

        if (this.animateOnce) {
          this.stopObserving();
        }
      }
    });
  }

  private triggerAnimation(element: HTMLElement) {
    setTimeout(() => {
      // Reset styles and add animation class
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
      element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';

      if (this.animationClass) {
        element.classList.add(this.animationClass);
      }
    }, this.animationDelay);
  }
}
