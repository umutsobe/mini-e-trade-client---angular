import { Component } from '@angular/core';

@Component({
  selector: 'app-role',
  template: `
    <div class="d-flex justify-content-center my-4 ">
      <button routerLink="create" class="btn-lg btn btn-primary me-2 ">Create Role</button>
      <button routerLink="list" class="btn-lg btn btn-primary">List Role</button>
    </div>

    <router-outlet></router-outlet>
  `,
})
export class RoleComponent {}
