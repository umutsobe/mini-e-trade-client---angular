import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelectionList } from '@angular/material/list';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { List_Role } from 'src/app/contracts/role/list_role';
import { List_User } from 'src/app/contracts/user/list_user';
import { RoleService } from 'src/app/services/models/role.service';
import { UserService } from 'src/app/services/models/user.service';

@Component({
  selector: 'app-user-list',
  template: `
    <ngx-spinner size="medium" type="ball-spin-clockwise-fade">Loading...</ngx-spinner>
    <h1 class="mt-2 text-center" id="title">Users</h1>
    <div style="box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px; padding: 10px;">
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr class="text-center">
              <th scope="col">userName</th>
              <th scope="col">email</th>
              <th scope="col">twoFactorEnabled</th>
              <th scope="col">assignRole</th>
            </tr>
          </thead>
          <tbody *ngIf="this.allUsers">
            <tr *ngFor="let user of this.allUsers.users" class="text-center">
              <td>{{ user.userName }}</td>
              <td>{{ user.email }}</td>
              <td>
                <img *ngIf="user.twoFactorEnabled" type="button" src="/assets/completed.png" width="25" style="cursor:pointer;" />
              </td>
              <td>
                <button (click)="openRoleDialog(user)" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#roleModal">Rol Ata</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-4 pagination d-flex justify-content-center">
        <div style="margin: 6px 8px 0 0;">{{ currentPageNo + 1 + '-' + totalPageCount }}</div>
        <div type="button" class="m-0 page-item"><a class="m-0 page-link" (click)="first()"><<</a></div>
        <div type="button" class="m-0 page-item"><a class="m-0 page-link" (click)="prev()"><</a></div>
        <div type="button" class="m-0 page-item"><a class="m-0 page-link" (click)="next()">></a></div>
        <div type="button" class="m-0 page-item"><a class="m-0 page-link" (click)="last()">>></a></div>
      </div>
    </div>

    <!-- action dialog -->

    <div class="modal fade" id="roleModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header"></div>
          <div class="modal-body">
            <div *ngIf="spinnerElement" class="spinner-border text-primary" role="status"></div>
            <mat-selection-list #rolesComponent>
              <mat-list-option *ngFor="let role of listRoles" selected="{{ role.selected }}">
                {{ role.name }}
              </mat-list-option>
            </mat-selection-list>
          </div>
          <div class="modal-footer">
            <button (click)="assignRoles(rolesComponent)" type="button" class="btn btn-primary">Rolleri Ata</button>
            <button (click)="closeDialog()" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      /* mat selection list kullanan her yere yapıştır. dark theme'de sorun çıkıyor */

      *:focus {
        box-shadow: none !important;
      }

      ::ng-deep .mat-mdc-list-item-unscoped-content {
        color: #8f8979 !important;
      }
      ::ng-deep .mdc-checkbox__background {
        border-color: #8f8979 !important;
      }
      /* .item {
        -webkit-line-clamp: 1;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
      } */
    `,
  ],
})
export class UserListComponent implements OnInit {
  constructor(private spinner: NgxSpinnerService, private toastr: ToastrService, private userService: UserService, private roleService: RoleService) {}

  allUsers: { totalUsersCount: number; users: List_User[] };
  currentPageNo: number = 0;
  totalUserCount: number;
  totalPageCount: number;
  pageSize: number = 8;

  spinnerElement: boolean = true;

  async getUsers() {
    this.spinner.show();

    const allUsers: { totalUsersCount: number; users: List_User[] } = await this.userService
      .getAllUsers(this.currentPageNo, this.pageSize)
      .catch((err) => {
        this.toastr.error(err);
        return { totalUsersCount: 0, users: null };
      })
      .finally(() => {
        this.spinner.hide();
      });

    this.allUsers = allUsers;
    this.totalUserCount = allUsers.totalUsersCount;
    this.totalPageCount = Math.ceil(this.totalUserCount / this.pageSize);
  }

  prev() {
    if (this.currentPageNo > 0) {
      this.currentPageNo--;
      this.getUsers();
    }
  }
  next() {
    if (this.currentPageNo != this.totalPageCount - 1) {
      this.currentPageNo++;
      this.getUsers();
    }
  }
  first() {
    this.currentPageNo = 0;
    this.getUsers();
  }
  last() {
    this.currentPageNo = this.totalPageCount - 1;
    this.getUsers();
  }

  selectedUser: List_User = {
    email: '',
    id: '',
    twoFactorEnabled: false,
    userName: '',
  };

  roles: { datas: List_Role[]; totalCount: number }; //ham rolümüz
  assignedRoles: Array<string> = []; // backende göndereceğimiz roller
  listRoles: { name: string; selected: boolean }[]; // listelerkenki rol formatımız

  async openRoleDialog(element: List_User) {
    this.selectedUser.email = element.email;
    this.selectedUser.id = element.id;
    this.selectedUser.twoFactorEnabled = element.twoFactorEnabled;
    this.selectedUser.userName = element.userName;

    this.assignedRoles = await this.userService.getRolesToUser(element.id, () => this.spinner.hide());

    this.roles = await this.roleService.getRoles(-1, -1);

    this.listRoles = this.roles.datas.map((r: any) => {
      return {
        name: r.name,
        selected: this.assignedRoles?.indexOf(r.name) > -1,
      };
    });
    this.spinnerElement = false;
  }

  closeDialog() {
    this.listRoles = [];
    this.spinnerElement = true;
  }

  assignRoles(rolesComponent: MatSelectionList) {
    const roles: string[] = rolesComponent.selectedOptions.selected.map((o) => o._elementRef.nativeElement.innerText);

    this.userService.assignRoleToUser(this.selectedUser.id, roles).then(
      () => {
        this.spinner.hide();
        this.toastr.success('Roller Başarıyla Atandı');
      },
      (err) => {
        this.spinner.hide();
        this.toastr.error(err);
      }
    );
  }

  async ngOnInit() {
    await this.getUsers();
  }

  // wdad
  refresh() {
    this.getUsers();
  }
  pageChanged() {
    this.getUsers();
  }
}
