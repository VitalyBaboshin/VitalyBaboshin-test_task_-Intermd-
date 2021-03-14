import {AfterContentInit, Component,} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'tst-inter-group-icons',
  templateUrl: './group-icons.component.html',
  styleUrls: ['./group-icons.component.scss']
  // encapsulation: ViewEncapsulation.None
})
export class GroupIconsComponent implements AfterContentInit {
  public title: string = null;
  public objInner: {}
  public result = {}
  public html
  public visible = true
  public fill: string = '#000000'

  constructor(private domSanitizer: DomSanitizer) {
  }

  ngAfterContentInit(): void {
      this.createElement(this.objInner)
      this.result = this.objInner
  }

  createElement(obj: {}) {
    //Создаем общий div, innerHtml которого, в конце передадим в DOM
    const divAllElement = document.createElement('div')

    for (let key in obj) {
      //Создаем контейнер куда передадим элемент svg и элемент p (имя svg)
      //key - name, value - svg содержимое,
      const divElement = document.createElement('div')
      divElement.classList.add('svg-container')
      //Добавили внутрь svg
      divElement.innerHTML = obj[key]
      divElement.firstElementChild.setAttribute('fill', this.fill)

      const pElement = document.createElement('p')
      pElement.classList.add('svg-name')
      pElement.innerText = key

      divElement.appendChild(pElement)
      divAllElement.appendChild(divElement)
    }

    //пропуск через санитайзер(удаляет лишний мусор и т.д.)
    this.html = this.domSanitizer.bypassSecurityTrustHtml(divAllElement.innerHTML)
  }

  //Установка заливки svg
  setFill(colorFill: string) {
    this.fill = colorFill
    this.createElement(this.result)
  }

  //Фильтруем лишнее
  seacrh(str: string) {
    this.result = {}

    for (let key in this.objInner) {
      if (key.includes(str)) {
        this.result[key] = this.objInner[key]
      }
    }
    this.createElement(this.result)
  }
}
