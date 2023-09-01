import { Component } from '@angular/core';

@Component({
  selector: 'app-role',
  template: `
    <div>
      <app-create-role></app-create-role>
    </div>
    <div>
      <app-role-list></app-role-list>
    </div>
  `,
})
export class RoleComponent {}
