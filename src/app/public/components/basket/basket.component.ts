import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-basket',
  template: `<p>basket component</p>
    <ngx-spinner size="medium" type="ball-spin-clockwise-fade">Loading...</ngx-spinner> `,
})
export class BasketComponent {
  constructor(private spinner: NgxSpinnerService) {}
  ngOnInit(): void {}
}
