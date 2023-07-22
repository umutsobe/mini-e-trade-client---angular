import { Component, Input } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { HttpClientService } from '../http-client.service';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-file-upload',
  template: `
    <div class="center">
      <ngx-file-drop dropZoneLabel="Drop files here" [accept]="fileFormats" (onFileOver)="fileOver($event)" (onFileLeave)="fileLeave($event)" (onFileDrop)="selectedFiles($event)">
        <!-- accept = seçilecek dosya tipini belirtir -->
        <ng-template ngx-file-drop-content-tmp let-openFileSelector="openFileSelector">
          <button class="btn btn-primary" type="button" (click)="openFileSelector()">Dosya Seç</button>
        </ng-template>
      </ngx-file-drop>
      <div class="upload-table" *ngIf="files">
        <table class="table">
          <thead>
            <tr>
              <th>Seçilenler</th>
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
    <button (click)="send()" *ngIf="files" class="btn btn-primary">Gönder</button>
  `,
})
export class FileUploadComponent {
  constructor(private http: HttpClientService, private toastr: ToastrService) {}
  public files: NgxFileDropEntry[];

  // @Input() options: Partial<FileUploadOptions>; //böyle daha modülerdi ama ben amele versiyonu yapacağım

  fileFormats: string = '.png, .jpg, .jpeg';

  public selectedFiles(files: NgxFileDropEntry[]) {
    this.files = files;
  }

  send() {
    for (const file of this.files) {
      const fileData: FormData = new FormData();
      (file.fileEntry as FileSystemFileEntry).file((_file: File) => {
        fileData.append(_file.name, _file, file.relativePath);
      });

      this.http
        .post(
          {
            controller: 'ProductControllers',
            action: 'upload',
          },
          fileData
        )
        .subscribe(
          (data) => {
            //success
            this.toastr.success('Dosya başarıyla eklenmiştir');
          },
          (error: HttpErrorResponse) => {
            //error
            this.toastr.error('Dosyalar yüklenirken hata oluştu');
          }
        );
    }
  }
  public fileLeave(event) {
    console.log(event);
  }
  public fileOver(event) {
    console.log(event);
  }
}

// export class FileUploadOptions {
//   controller?: string;
//   action?: string;
//   queryString?: string;
//   explanation?: string;
//   fileType?: string;
// }
