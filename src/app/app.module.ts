import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from 'src/app/app.component';
import {ListIconsModule} from './listIcons/list-icons.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ListIconsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
