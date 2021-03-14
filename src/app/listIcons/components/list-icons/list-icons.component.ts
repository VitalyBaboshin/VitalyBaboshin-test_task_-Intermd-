import {
  AfterViewInit, ChangeDetectorRef,
  Component,
  ComponentFactoryResolver, ComponentRef,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {BASIC_ICONS} from "../../../shared/basic_icons";
import {SafeHtmlImpl} from "../../service/type/type";
import {GroupIconsComponent} from "../group-icons/group-icons.component";



@Component({
  selector: 'tst-inter-list-icons',
  templateUrl: './list-icons.component.html',
  styleUrls: ['./list-icons.component.scss']
})
export class ListIconsComponent implements OnInit, AfterViewInit{
  @ViewChild("containerForGroup", { read: ViewContainerRef }) VCRforGroup: ViewContainerRef;

  componentsReferences = Array<ComponentRef<GroupIconsComponent>>()

  globObjSvg = [];

  // при формировании общего объекта svg, одновременно создаем массив
  // только с имена svg(для последующей легкой фильтрации)
  nameForSearch = [];
  // Пустой результат фильтрации или нет
  isEmpty = false

  constructor(private domSanitizer: DomSanitizer,
              private CFR: ComponentFactoryResolver,
              private changeDetector: ChangeDetectorRef) {
  }


  ngOnInit() {
    this.createObjectSvgForDynamic()
  }

  ngAfterViewInit() {
    this.renderWidgetGroupSvg()
  }

  createObjectSvgForDynamic():void {
    let divTemp = document.createElement('div')

    for (let key in BASIC_ICONS) {
      let createSvg
      this.nameForSearch.push(key)

      //Обрабатываем санитайзером SVG, приводим к нормальному виду
      let newSvg: SafeHtmlImpl = <SafeHtmlImpl>this.domSanitizer.bypassSecurityTrustHtml(BASIC_ICONS[key])
      divTemp.insertAdjacentHTML('beforeend', newSvg.changingThisBreaksApplicationSecurity )

      // Или не обрабатываем
      // divTemp.insertAdjacentHTML('beforeend', BASIC_ICONS[key])

      // Удаляем аттрибут fill, возможно необходимо пройтись циклом по всем элементам внутри svg?
      if (divTemp.lastElementChild.lastElementChild.hasAttribute('fill')){
        divTemp.lastElementChild.lastElementChild.removeAttribute('fill')
      }

      // Берем тело SVG без аттрибутов
      const bodySVG = divTemp.lastElementChild.innerHTML
      const width = divTemp.lastElementChild.getAttribute('width')
      const viewBox = divTemp.lastElementChild.getAttribute('viewBox')

      createSvg = document.createElement('svg')
      createSvg.innerHTML = bodySVG

      this.setAttributes(createSvg,{
        xmlns : 'http://www.w3.org/2000/svg',
        viewBox : this.getViewBox(viewBox, width)
      })

      // Временная переменная ширины Svg с помощью который и разобьем на группы
      const paramWidth = createSvg.getAttribute('viewBox').split(' ')[2]

      //Формируем глобальны массив с объектами для последуещего создания динамических компонентов
      let tempObj = {}
      let tempObj2 = {}
      tempObj2[key]= createSvg.outerHTML
      tempObj[paramWidth] = tempObj2
      if (this.globObjSvg.length === 0) {
        this.globObjSvg.push(tempObj)
      } else {
        let find = false
        for (let i of this.globObjSvg) {
          if (i.hasOwnProperty(paramWidth)) {
            i[paramWidth][key]=tempObj2[key]
            find = true
          }
        }
        if (!find) this.globObjSvg.push(tempObj)
      }
    }
  }

  // Создаем динамические компоненты и передаем в них параметры
  private renderWidgetGroupSvg() {

    for (let objSize of this.globObjSvg) {
      const sizeSvg = Object.keys(objSize).toString()
      const objInner = objSize[Object.keys(objSize).toString()]

      let componentFactory = this.CFR.resolveComponentFactory(GroupIconsComponent);
      let childComponentRef = this.VCRforGroup.createComponent(componentFactory);
      let childComponent = childComponentRef.instance;
      this.componentsReferences.push(childComponentRef);

      childComponent.objInner = objInner
      childComponent.title = sizeSvg
    }

    // Принудительно запускает механизм отслеживания изменений;
    // без нее ошибочки вылетают, хоть без нее и работает
    this.changeDetector.detectChanges();
  }

  // если нету аттрибута viewBox, то возвращаем viewBox сделанный на основе width
  // иначе возвращаем viewBox
  private getViewBox(viewBox, width): string {
    if (viewBox !== null) {
      return viewBox
    } else {
      if (width !== null) {
        return `0 0 ${width} ${width}`
      } else {
        return '0 0 0 0'
      }
    }
  }

  // Установка аттрибутов элементу разом
  private setAttributes(el, attrs) {
    for(let key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
  }

  // Фильтр
  onSearchCustomer($event: any) {
    const tempNameForSearch = this.nameForSearch.filter(x => x.includes($event.target.value))
    if (tempNameForSearch.length) {
      this.isEmpty = false
    } else {
      this.isEmpty = true
    }

    // В каждом, ранее динамически созданом, компоненте запускам функцию фильтраци
    // передаем в функции строку
    this.componentsReferences.map(x => {
      x.instance.seacrh($event.target.value)
    })

  }

  // В каждом, ранее динамически созданом, компоненте запускам функцию setFill
  // для изменения fill в svg
  setFillSvg(colorFill: string) {
    this.componentsReferences.map(x => {
      x.instance.setFill(colorFill)
    })
  }
}
