import { Component, Input } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { HttpClientService } from '../http-client.service';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { IdExchangeService } from '../../data-exchange/id-exchange.service';

@Component({
  selector: 'app-file-upload',
  template: `
    <div class="center">
      <ngx-file-drop dropZoneLabel="Drop files here" [accept]="fileFormats" (onFileDrop)="selectedFiles($event)">
        <!-- accept = seçilecek dosya tipini belirtir -->
        <ng-template ngx-file-drop-content-tmp let-openFileSelector="openFileSelector">
          <button class="btn btn-primary" type="button" (click)="openFileSelector()">Select Files</button>
        </ng-template>
      </ngx-file-drop>
      <div class="upload-table" *ngIf="files.length > 0">
        <table class="table">
          <thead>
            <tr>
              <th>Selected Items</th>
            </tr>
          </thead>
          <tbody class="upload-name-style">
            <tr *ngFor="let item of files; let i = index">
              <td>
                <strong>{{ item.relativePath }}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <button (click)="send()" *ngIf="files.length > 0" class="btn btn-success">Send</button>
    <button (click)="cancel()" *ngIf="files.length > 0" class="d-block mt-2 btn-sm btn btn-warning">Cancel</button>
  `,
})
export class FileUploadComponent {
  constructor(private http: HttpClientService, private toastr: ToastrService, private spinner: NgxSpinnerService, private idService: IdExchangeService) {}

  @Input() definition: string;
  isProduct: boolean;

  public selectedFiles(files: NgxFileDropEntry[]) {
    this.files = files;
  }

  send() {
    this.spinner.show();
    if (this.definition == 'product') this.productFileSend();

    this.spinner.hide();
  }
  cancel() {
    this.files = [];
  }

  fileFormats = '.png, .jpg, .jpeg, .webP';
  public files: NgxFileDropEntry[] = [];
  productFileSend() {
    for (const file of this.files) {
      const fileData: FormData = new FormData();
      (file.fileEntry as FileSystemFileEntry).file((_file: File) => {
        fileData.append(_file.name, _file, file.relativePath);
      });

      this.http
        .post(
          {
            controller: 'Product',
            action: 'UploadProductImage',
            queryString: `id=${this.idService.getId()}`,
          },
          fileData
        )
        .subscribe(
          (data) => {
            //success
            this.toastr.success('File has been successfully added.');
            this.spinner.hide();
          },
          (error: HttpErrorResponse) => {
            //error
            this.toastr.error('An error occurred while uploading files.');
            this.spinner.hide();
          }
        );
    }
    this.files = [];
  }
}
