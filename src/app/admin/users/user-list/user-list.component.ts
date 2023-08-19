import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelectionList } from '@angular/material/list';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
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
    <div class="mat-elevation-z8">
      <table mat-table [dataSource]="dataSource">
        <ng-container matColumnDef="userName">
          <th class="text-center" mat-header-cell *matHeaderCellDef>userName</th>
          <td class="text-center" mat-cell *matCellDef="let element">{{ element.userName }}</td>
        </ng-container>

        <ng-container matColumnDef="email">
          <th class="text-center" mat-header-cell *matHeaderCellDef>email</th>
          <td class="text-center" mat-cell *matCellDef="let element">{{ element.email }}</td>
        </ng-container>

        <ng-container matColumnDef="twoFactorEnabled">
          <th class="text-center" mat-header-cell *matHeaderCellDef>twoFactorEnabled</th>
          <td class="text-center" mat-cell *matCellDef="let element">
            <img *ngIf="element.twoFactorEnabled" type="button" src="/assets/completed.png" width="25" style="cursor:pointer;" />
          </td>
        </ng-container>

        <ng-container matColumnDef="assignRole">
          <th class="text-center" mat-header-cell *matHeaderCellDef>assignRole</th>
          <td class="text-center" mat-cell *matCellDef="let element">
            <button (click)="openRoleDialog(element)" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#roleModal">Rol Ata</button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>

      <mat-paginator (page)="pageChanged()" [pageSizeOptions]="[5, 10]" showFirstLastButtons aria-label="Select page of periodic elements"> </mat-paginator>
    </div>
    <div class="d-flex justify-content-end mt-2">
      <button (click)="refresh()" id="refresh" class="btn btn-primary">Refresh</button>
    </div>

    <!-- action dialog -->

    <div class="modal fade" id="roleModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header"></div>
          <div class="modal-body">
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
})
export class UserListComponent implements OnInit {
  constructor(private spinner: NgxSpinnerService, private toastr: ToastrService, private userService: UserService, private roleService: RoleService) {}

  displayedColumns: string[] = ['userName', 'email', 'twoFactorEnabled', 'assignRole'];
  dataSource: MatTableDataSource<List_User> = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  roles: { datas: List_Role[]; totalCount: number }; //ham rolümüz
  assignedRoles: Array<string> = []; // backende göndereceğimiz roller
  listRoles: { name: string; selected: boolean }[]; // listelerkenki rol formatımız

  async getUsers() {
    this.spinner.show();

    const allUsers: { totalUsersCount: number; users: List_User[] } = await this.userService.getAllUsers(
      this.paginator ? this.paginator.pageIndex : 0,
      this.paginator ? this.paginator.pageSize : 5,
      () => this.spinner.hide(),
      (errorMessage) => this.toastr.error(errorMessage)
    );
    this.dataSource = new MatTableDataSource<List_User>(allUsers.users);
    this.paginator.length = allUsers.totalUsersCount;
  }

  selectedUser: List_User = {
    email: '',
    id: '',
    twoFactorEnabled: false,
    userName: '',
  };

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
  }

  closeDialog() {
    this.listRoles = [];
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
