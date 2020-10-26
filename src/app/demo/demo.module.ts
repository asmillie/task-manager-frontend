import { NgModule } from '@angular/core';
import { DemoComponent } from './demo.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [DemoComponent],
  imports: [
    SharedModule,
    RouterModule,
  ]
})
export class DemoModule { }
