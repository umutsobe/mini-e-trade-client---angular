import { Component } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-root',
  template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {}
$(document).ready(() => {
  alert('addawd');
});
