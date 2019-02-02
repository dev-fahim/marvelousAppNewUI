import { ShadowDirective } from './dropdown.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionDirective } from './accordion.directive';
import { ModalDirective } from './modal.directive';

@NgModule({
  declarations: [
    ShadowDirective,
    AccordionDirective,
    ModalDirective
  ],
  exports: [
    CommonModule,
    ShadowDirective,
    AccordionDirective,
    ModalDirective
  ]
})
export class SharedModule { }
