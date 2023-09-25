import { Component, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { List_Role } from 'src/app/contracts/role/list_role';
import { IdExchangeService } from 'src/app/services/data-exchange/id-exchange.service';
import { RoleService } from 'src/app/services/models/role.service';

@Component({
  selector: 'app-role-list',
  template: `
    <h1 class="mt-4 text-center" id="title">Roles</h1>
    <div style="box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px; padding: 10px;">
      <table class="table table-striped table-responsive">
        <thead>
          <tr class="text-center">
            <th scope="col">name</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody *ngIf="this.allRoles">
          <tr *ngFor="let role of this.allRoles.datas" class="text-center">
            <td>{{ role.name }}</td>
            <td>
              <img type="button" data-bs-toggle="modal" data-bs-target="#deleteModal" (click)="openDeleteDialog(role)" src="/assets/delete.png" width="25" style="cursor:pointer;" />
            </td>
          </tr>
        </tbody>
      </table>

      <div class="mt-4 pagination d-flex justify-content-center">
        <div style="margin: 6px 8px 0 0;">{{ currentPageNo + 1 + '-' + totalPageCount }}</div>
        <div type="button" class="m-0 page-item"><a class="m-0 page-link" (click)="first()"><<</a></div>
        <div type="button" class="m-0 page-item"><a class="m-0 page-link" (click)="prev()"><</a></div>
        <div type="button" class="m-0 page-item"><a class="m-0 page-link" (click)="next()">></a></div>
        <div type="button" class="m-0 page-item"><a class="m-0 page-link" (click)="last()">>></a></div>
      </div>
    </div>

    <!-- delete dialog -->

    <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Rol Silme İşlemi</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p class="text-danger">Rol silme işlemi geri alınamaz!!!</p>
            <p>Silinecek Rol: {{ selectedRole ? selectedRole.name : '' }}</p>
            <!-- null hatası almamak için kontrol -->
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button (click)="delete()" type="button" class="btn btn-danger" data-bs-dismiss="modal">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class RoleListComponent {
  constructor(private roleService: RoleService, private spinner: NgxSpinnerService, private toastr: ToastrService, private idService: IdExchangeService) {}

  allRoles: { totalCount: number; datas: List_Role[] };
  currentPageNo = 0;
  totalRoleCount: number;
  totalPageCount: number;
  pageSize = 8;

  async getRoles() {
    this.spinner.show();

    const allRoles: { totalCount: number; datas: List_Role[] } = await this.roleService.getRoles(
      this.currentPageNo,
      this.pageSize,
      () => {
        this.spinner.hide();
      },
      (errorMessage) => {
        this.spinner.hide();
      }
    );

    this.allRoles = allRoles;
    this.totalRoleCount = allRoles.totalCount;
    this.totalPageCount = Math.ceil(this.totalRoleCount / this.pageSize);
  }
  prev() {
    if (this.currentPageNo > 0) {
      this.currentPageNo--;
      this.getRoles();
    }
  }
  next() {
    if (this.currentPageNo != this.totalPageCount - 1) {
      this.currentPageNo++;
      this.getRoles();
    }
  }
  first() {
    this.currentPageNo = 0;
    this.getRoles();
  }
  last() {
    this.currentPageNo = this.totalPageCount - 1;
    this.getRoles();
  }
  selectedRole: List_Role = {
    id: '',
    name: '',
  };

  openDeleteDialog(element) {
    this.selectedRole = element;
  }

  delete() {
    this.spinner.show();

    this.roleService
      .delete(this.selectedRole.id)
      .then(() => {
        this.spinner.hide();
        this.toastr.success(`${this.selectedRole.name} başarıyla silindi`, 'Başarılı');
        this.getRoles();
      })
      .catch((err) => {
        this.spinner.hide();
      });
  }

  async ngOnInit() {
    await this.getRoles();
  }
  async pageChanged() {
    await this.getRoles();
  }
  async refresh() {
    await this.getRoles();
  }
}
