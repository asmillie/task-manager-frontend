import { NgModule } from '@angular/core';
import { DemoComponent } from './demo.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { RecaptchaModule } from 'ng-recaptcha';


@NgModule({
  declarations: [DemoComponent],
  imports: [
    SharedModule,
    RouterModule,
    RecaptchaModule,
  ]
})
export class DemoModule { }
