import {
  AfterContentInit, AfterViewInit, ChangeDetectorRef,
  Component,
} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {filter} from "rxjs/operators";

@Component({
  selector: 'tst-inter-group-icons',
  templateUrl: './group-icons.component.html',
  styleUrls: ['./group-icons.component.scss']
  // encapsulation: ViewEncapsulation.None
})
export class GroupIconsComponent implements AfterContentInit {
  public title: string = null;
  public objInner: {}
  public html
  public visible = true
  public result = {}
  public fill: string = '#000000'
  // private mass = [ {}]

  constructor(private domSanitizer: DomSanitizer) {
    // this.result = this.objInner
  }

  ngAfterContentInit(): void {
      this.createElement(this.objInner)
      this.result = this.objInner
  }

  setFill(colorFill: string) {
    this.fill = colorFill
    this.createElement(this.result)
  }

  seacrh(str: string) {
    this.result = {}

    for (let key in this.objInner) {
      if (key.includes(str)) {
        this.result[key] = this.objInner[key]
      }
    }

    this.createElement(this.result)
  }

  createElement(obj: {}) {
    console.log('this.objInner', obj)

    const divAllElement = document.createElement('div')
    for (let key in obj) {
      const divElement = document.createElement('div')
      divElement.classList.add('svg-container')

      divElement.innerHTML = obj[key]
      // console.log(divElement.innerHTML)
      divElement.firstElementChild.setAttribute('fill', this.fill)
      //
      const pElement = document.createElement('p')
      pElement.classList.add('svg-name')
      pElement.innerText = key
      //
      // // console.log(key)
      // // console.log(this.objInner[key])
      //
      divElement.appendChild(pElement)
      divAllElement.appendChild(divElement)
    }
    console.log(divAllElement)

    this.html = this.domSanitizer.bypassSecurityTrustHtml(divAllElement.innerHTML)
  }

}
