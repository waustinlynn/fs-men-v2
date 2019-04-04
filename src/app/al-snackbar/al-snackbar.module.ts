import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlSnackbarComponent } from './al-snackbar.component';

@NgModule({
  declarations: [AlSnackbarComponent],
  imports: [
    CommonModule
  ],
  exports: [
    AlSnackbarComponent
  ]
})
export class AlSnackbarModule { }
