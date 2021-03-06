import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ListIconsComponent} from 'src/app/listIcons/components/list-icons/list-icons.component';
import {FormsModule} from '@angular/forms';
import {IconsService} from './service/icons.service';
import {GroupIconsComponent} from './components/group-icons/group-icons.component';
import {SpinnerComponent} from '../shared/components/spinner/spinner.component';
import {ThemeDirective} from 'src/app/listIcons/shared/directives/theme.directive';


@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [ListIconsComponent, GroupIconsComponent, SpinnerComponent, ThemeDirective],
  exports: [ListIconsComponent],
  providers: [IconsService],
  entryComponents: [GroupIconsComponent]
})

export class ListIconsModule {}
