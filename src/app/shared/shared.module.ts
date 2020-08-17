import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { AlertComponent } from './alert/alert.component';
import { TableSortDirective } from './directives/table-sort.directive';

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    AlertComponent,
    TableSortDirective,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
    AlertComponent,
  ],
})
export class SharedModule { }
