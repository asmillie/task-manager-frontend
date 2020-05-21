import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavModule } from './nav/nav.module';
import { TaskManagerModule } from './task-manager/task-manager.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NavModule,
    TaskManagerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
