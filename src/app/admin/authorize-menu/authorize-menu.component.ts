import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatSelectionList } from '@angular/material/list';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Action } from 'src/app/contracts/application-configurations/action';
import { List_Role } from 'src/app/contracts/role/list_role';
import { ApplicationService } from 'src/app/services/models/application.service';
import { AuthorizationEndpointService } from 'src/app/services/models/authorization-endpoint.service';
import { RoleService } from 'src/app/services/models/role.service';

@Component({
  selector: 'app-authorize-menu',
  template: `
    <div class="p-0 m-0" style="margin-bottom: 500px;">
      <button (click)="updateEndpoints()" class="btn btn-primary ms-3 mb-3 btn-sm">UpdateMenusAndEndpoints</button>

      <mat-tree class="bg-dark" [dataSource]="dataSource" [treeControl]="treeControl">
        <mat-tree-node *matTreeNodeDef="let node" matTreeNodePadding class="ps-0 ps-md-5 mb-1">
          <!-- <button mat-icon-button disabled></button> -->
          <button class="btn btn-primary btn-sm me-3 p-1 text-truncate" style="width: 66px;" (click)="openRoleDialog(node.code, node.name, node.menuName)" data-bs-toggle="modal" data-bs-target="#roleModal">Rol Ata</button>
          <div class="me-1 text-truncate" style="width: fit-content;">{{ node.name }}</div>
          <div class="me-1 text-truncate" style="color: green;" *ngFor="let role of node.newAssignedRoles">({{ role }})</div>
        </mat-tree-node>

        <mat-tree-node *matTreeNodeDef="let node; when: hasChild" matTreeNodePadding>
          <button mat-icon-button matTreeNodeToggle [attr.aria-label]="'Toggle ' + node.name">
            <mat-icon class="mat-icon-rtl-mirror">
              {{ treeControl.isExpanded(node) ? 'expand_more' : 'chevron_right' }}
            </mat-icon>
          </button>
          {{ node.name }}
        </mat-tree-node>
      </mat-tree>
    </div>

    <!-- action dialog -->

    <div class="modal fade" id="roleModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title" id="exampleModalLabel">Code: {{ selectedAction.code }}</h2>
          </div>
          <div class="modal-body">
            <h3 class="modal-title" id="exampleModalLabel">Definition: {{ selectedAction.definition }}</h3>

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
    `,
  ],
})
export class AuthorizeMenuComponent implements OnInit {
  constructor(private spinner: NgxSpinnerService, private applicationService: ApplicationService, public authorizationEndpointService: AuthorizationEndpointService, private roleService: RoleService, private toastr: ToastrService) {}

  roles: { datas: List_Role[]; totalCount: number }; //ham rolümüz
  assignedRoles: Array<string> = []; // backende göndereceğimiz roller
  listRoles: { name: string; selected: boolean }[]; // listelerkenki rol formatımız

  selectedAction: Action = {
    code: '',
    definition: '',
    actionType: '',
    httpType: '',
    menuName: '',
    assignedRoles: [],
  };

  async openRoleDialog(code: string, name: string, menuName: string) {
    this.selectedAction.code = code;
    this.selectedAction.definition = name;
    this.selectedAction.actionType = code.split('.')[1];
    this.selectedAction.httpType = code.split('.')[0];
    this.selectedAction.menuName = menuName;

    const _selectedAction: Action = this.selectedAction;

    this.assignedRoles = await this.authorizationEndpointService.getRolesToEndpoint(_selectedAction.code, _selectedAction.menuName);

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
    this.spinner.show();

    const roles: string[] = rolesComponent.selectedOptions.selected.map((o) => o._elementRef.nativeElement.innerText);

    this.authorizationEndpointService
      .assignRoleEndpoint(roles, this.selectedAction.code, this.selectedAction.menuName)
      .then(() => {
        this.spinner.hide();
        this.toastr.success('Başarılı');
      })
      .catch((err) => {
        this.spinner.hide();
        this.toastr.error(err);
      });
  }

  updateEndpoints() {
    this.spinner.show();
    this.authorizationEndpointService
      .updateEndpoints()
      .then(() => {
        this.spinner.hide();
        this.toastr.success('Updated Menus and Endpoints');
      })
      .catch((err) => {
        this.spinner.hide();
        this.toastr.error(err);
      });
  }

  async ngOnInit() {
    this.dataSource.data = (await this.applicationService.getAuthorizeDefinitionEndpoints()).map((m) => {
      const treeMenu: ITreeMenu = {
        name: m.name,
        actions: m.actions.map((a) => {
          const _treeMenu: ITreeMenu = {
            name: a.definition,
            code: a.code,
            menuName: m.name,
            newAssignedRoles: a.assignedRoles,
          };

          return _treeMenu;
        }),
      };

      return treeMenu;
    });
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    (menu: ITreeMenu, level: number) => {
      return {
        expandable: menu.actions?.length > 0,
        name: menu.name,
        level: level,
        code: menu.code,
        menuName: menu.menuName,
        newAssignedRoles: menu.newAssignedRoles,
      };
    },
    (menu) => menu.level,
    (menu) => menu.expandable,
    (menu) => menu.actions
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
}

interface ITreeMenu {
  name?: string;
  actions?: ITreeMenu[];
  code?: string;
  menuName?: string;
  newAssignedRoles?: string[];
}

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}
