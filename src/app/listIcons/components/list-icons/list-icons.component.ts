import {
  AfterContentInit,
  AfterViewInit, ChangeDetectorRef,
  Component,
  ComponentFactoryResolver, ComponentRef,
  ElementRef, EventEmitter,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {BASIC_ICONS} from "../../../shared/basic_icons";
import {SafeHtmlImpl} from "../../service/type/type";
import {GroupIconsComponent} from "../group-icons/group-icons.component";
import {log} from "util";
import {Subject} from "rxjs";


@Component({
  selector: 'tst-inter-list-icons',
  templateUrl: './list-icons.component.html',
  styleUrls: ['./list-icons.component.scss']
})
export class ListIconsComponent implements OnInit, AfterViewInit, AfterContentInit{
  @ViewChild("containerForGroup", { read: ViewContainerRef }) VCRforGroup: ViewContainerRef;
  @ViewChild('dataContainer') dataContainer: ElementRef;

  componentsReferences = Array<ComponentRef<GroupIconsComponent>>()

  searchStr: string
  globObjSvg = [];
  nameForSearch = [];
  isEmpty = false



  constructor(private domSanitizer: DomSanitizer,
              private CFR: ComponentFactoryResolver,
              private changeDetector: ChangeDetectorRef) {
  }


  ngOnInit() {

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

      const paramWidth = createSvg.getAttribute('viewBox').split(' ')[2]
      // console.log(this.createSvg)


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
      // this.globObjSvg[key] = [paramWidth, this.createSvg.outerHTML]
    }
    console.log(this.nameForSearch)
    console.log(this.globObjSvg)


  }

  ngAfterViewInit() {
    this.renderWidgetInsideWidgetContainer()
    // console.log('outet HTML', this.createSvg.outerHTML)
    // this.cd.detectChanges();


  }

  ngAfterContentInit() {

    // this.html = this.domSanitizer.bypassSecurityTrustHtml(this.createSvg.outerHTML)
    // console.log(divTemp2.innerHTML)
  }

  renderWidgetInsideWidgetContainer() {
    for (let objSize of this.globObjSvg) {
      const sizeSvg = Object.keys(objSize).toString()
      // const sizeSvg = Object.keys(objSize).toString()
      console.log(sizeSvg)
      const objInner = objSize[Object.keys(objSize).toString()]
      // console.log(objSize[Object.keys(objSize).toString()])
      // console.log(Object.keys(objSize).toString())
      // console.log(objSize[Object.keys(objSize).toString()])
      let componentFactory = this.CFR.resolveComponentFactory(GroupIconsComponent);
      let childComponentRef = this.VCRforGroup.createComponent(componentFactory);
      let childComponent = childComponentRef.instance;
      this.componentsReferences.push(childComponentRef);


        childComponent.objInner = objInner
        childComponent.title = sizeSvg



      // childComponent.title = key
    }
    this.changeDetector.detectChanges();
  }

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

  private setAttributes(el, attrs) {
    for(let key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
  }


  onSearchCustomer($event: any) {
    // console.log($event.target.value)
    // if (this.VCRforGroup.length < 1) return;
    // console.log(this.VCRforGroup)
    // this.isEmpty
    const tempNameForSearch = this.nameForSearch.filter(x => x.includes($event.target.value))
    if (tempNameForSearch.length) {
      this.isEmpty = false
    } else {
      this.isEmpty = true
    }

    this.componentsReferences.map(x => {
      x.instance.seacrh($event.target.value)
    })
    // for(let childComponent of this.componentsReferences) {
    //   let childComponent = this.componentsReferences.instance
    // }
    console.log('this.isempty', this.isEmpty)
    console.log('tempNameForSearch', tempNameForSearch)
    console.log('this.nameForSearch', this.nameForSearch)

  }


  setFillSvg(colorFill: string) {
    this.componentsReferences.map(x => {
      // x.instance.fill = colorFill
      x.instance.setFill(colorFill)
    })
  }
}
