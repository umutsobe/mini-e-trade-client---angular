import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  template: `
    <p>home component</p>
    <br />
    <button (click)="alert()" class="btn btn-primary">Alert</button>
  `,
})
export class HomeComponent {
  constructor(private toastr: ToastrService) {}
  alert() {
    this.toastr.success('message', 'title');
  }
}
