import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { NgxSpinnerService } from 'ngx-spinner';
import { Action } from 'src/app/contracts/application-configurations/action';
import { ApplicationService } from 'src/app/services/models/application.service';

@Component({
  selector: 'app-authorize-menu',
  template: `
    <mat-tree class="bg-dark mb-1" [dataSource]="dataSource" [treeControl]="treeControl">
      <mat-tree-node *matTreeNodeDef="let node" matTreeNodePadding>
        <button mat-icon-button disabled></button>
        <button class="btn btn-primary btn-sm mx-3" (click)="openRoleDialog(node.code, node.name)" data-bs-toggle="modal" data-bs-target="#roleModal">Rol Ata</button> {{ node.name }}
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

    <!-- action dialog -->

    <div class="modal fade" id="roleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title" id="exampleModalLabel">Code: {{ selectedAction.code }}</h2>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <h3 class="modal-title" id="exampleModalLabel">Definition: {{ selectedAction.definition }}</h3>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AuthorizeMenuComponent implements OnInit {
  constructor(spinner: NgxSpinnerService, private applicationService: ApplicationService) {}

  async ngOnInit() {
    this.dataSource.data = await (
      await this.applicationService.getAuthorizeDefinitionEndpoints()
    ).map((m) => {
      const treeMenu: ITreeMenu = {
        name: m.name,
        actions: m.actions.map((a) => {
          const _treeMenu: ITreeMenu = {
            name: a.definition,
            code: a.code,
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
      };
    },
    (menu) => menu.level,
    (menu) => menu.expandable,
    (menu) => menu.actions
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  selectedAction: Action = {
    code: '',
    definition: '',
    actionType: '',
    httpType: '',
  };

  openRoleDialog(code: string, name: string) {
    this.selectedAction.code = code;
    this.selectedAction.definition = name;
    this.selectedAction.actionType = code.split('.')[1];
    this.selectedAction.httpType = code.split('.')[0];
  }
}

interface ITreeMenu {
  name?: string;
  actions?: ITreeMenu[];
  code?: string;
}

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}
