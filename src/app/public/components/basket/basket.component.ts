import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-basket',
  template: `<p>basket component</p>
    <ngx-spinner size="medium" type="ball-spin-clockwise-fade">Loading...</ngx-spinner> `,
})
export class BasketComponent {
  constructor(private spinner: NgxSpinnerService) {}
  ngOnInit(): void {
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 2000);
  }
}
