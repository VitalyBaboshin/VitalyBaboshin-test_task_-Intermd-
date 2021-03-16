import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[Theme]'
})
export class ThemeDirective implements OnChanges {
  @Input('Theme') theme: string;

  constructor(private el: ElementRef<HTMLElement>) {
  }

  ngOnChanges() {
      this.el.nativeElement.style.setProperty(`--${'color-fill'}`, this.theme);
  }
}
