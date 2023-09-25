import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageCroppedEvent, ImageTransform, LoadedImage, base64ToFile } from 'ngx-image-cropper';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Image } from 'src/app/contracts/product/image';
import { HttpClientService } from 'src/app/services/common/http-client.service';
import { FileService } from 'src/app/services/models/file.service';
import { ImageService } from 'src/app/services/models/image.service';

@Component({
  selector: 'app-images',
  template: `
    <div>
      <section class="border rounded-3 p-3">
        <h2 class="text-center">Home Page Images</h2>
        <p class="fw-bold m-0" style="color: green;">Tip: You can sort the images by dragging and dropping.</p>
        <p class="fw-bold" style="color: green;">Tip: Click to enlarge image.</p>
        <!-- images -->
        <div class="list-images">
          <div cdkDropList cdkDropListOrientation="horizontal" class="example-list d-flex pb-5" (cdkDropListDropped)="drop($event)" cdkDropListGroup>
            <div *ngFor="let homePageImage of homePageImages" cdkDrag>
              <div style="flex: 1 0 5rem;" class="card m-1 p-3">
                <div>
                  <p-image src="{{ baseUrl }}/{{ homePageImage.path }}" class="d-flex justify-content-center" alt="{{ homePageImage.fileName }}" width="240" height="80" [preview]="true"></p-image>
                </div>
                <div class="m-1 d-flex justify-content-center" style="width: 100%;cursor: move !important;">
                  <button (click)="deleteHomePageImage(homePageImage.id)" class=" btn btn-danger">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <a (click)="saveSortedList()" role="button" class="p-1 text-decoration-none user-select-none">Save Sorted List</a>
        <div class="my-3">
          <button class="btn btn-primary my-1" onclick="document.getElementById('getFile').click()">Select Image and Crop</button>
          <input type="file" id="getFile" style="display:none" (change)="fileChangeEvent($event)" />
          <div style="width: 340px;">
            <image-cropper *ngIf="isHidden" [imageChangedEvent]="imageChangedEvent" [maintainAspectRatio]="true" [aspectRatio]="3 / 1" (imageCropped)="imageCropped($event)"></image-cropper>
          </div>
          <div *ngIf="!isHidden" class="imagePreview mt-2" style="width: 250px; height: 140px;"></div>
          <div *ngIf="isHidden" class="p-2 " style="width: 100%;">
            <p class="my-1 fw-bold">Image Preview</p>
            <img [src]="croppedImage" height="300" class="imagePreview p-2" />
          </div>

          <button (click)="uploadHomeImage()" *ngIf="isHidden" class="mt-2 btn btn-success">Upload Image</button>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      /* drag drop sort angular material */
      .example-list {
        overflow-x: auto;
      }
      .cdk-drag-preview {
        box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
      }
      .cdk-drag-placeholder {
        opacity: 0;
      }
      .cdk-drag-animating {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }
      .example-list.cdk-drop-list-dragging .example-box:not(.cdk-drag-placeholder) {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }
      /* end */
      .imagePreview {
        border: dashed 2px gray;
      }
    `,
  ],
})
export class ImageControlComponent implements OnInit, AfterViewChecked {
  homePageImages: Image[];
  definition = 'home';
  baseUrl: string = '';

  constructor(private imageService: ImageService, private toastr: ToastrService, private spinner: NgxSpinnerService, private fileService: FileService, private http: HttpClientService, private sanitizer: DomSanitizer) {}
  ngAfterViewChecked(): void {}

  async ngOnInit() {
    this.baseUrl = (await this.fileService.getBaseStorageUrl()).url;
    this.getHomePageImages();
  }
  async getHomePageImages() {
    this.homePageImages = await this.imageService.getImagesByDefinition('home');
  }

  async saveSortedList() {
    this.spinner.show();

    let sortedList: UpdateOrderDefinition = {
      definition: 'home',
      images: [],
    };

    for (let index = 0; index < this.homePageImages.length; index++) {
      let image = this.homePageImages[index];
      let newImage: UpdateOrderDefinitionImage = {
        imageId: image.id,
        order: index,
      };
      sortedList.images.push(newImage);
    }

    await this.imageService
      .updateOrderDefinitionImages(sortedList)
      .then(() => this.toastr.success('Success'))
      .finally(() => this.spinner.hide());
  }

  deleteHomePageImage(id) {
    this.spinner.show();
    this.imageService
      .deleteImage(id)
      .then(() => this.getHomePageImages())
      .finally(() => this.spinner.hide());
  }
  refresh() {
    this.getHomePageImages();
  }

  //drag and drop sorting

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.homePageImages, event.previousIndex, event.currentIndex);
  }

  //#region crop and upload image

  imageChangedEvent: any = '';
  croppedImage: any = '';
  isHidden = false;
  blob: any;

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.isHidden = true;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
    this.blob = event.blob;

    // event.blob can be used to upload the cropped image
  }

  uploadHomeImage() {
    this.spinner.show();
    const fileData = new FormData();
    fileData.append('blob', this.blob, 'filename.png');

    this.http
      .post(
        {
          controller: 'image',
          action: 'UploadImage',
          queryString: `definition=${this.definition}`,
        },
        fileData
      )
      .subscribe(
        () => {
          this.toastr.success('File has been successfully added.');
          this.isHidden = false;
          this.croppedImage = '';
          this.getHomePageImages();
        },
        () => this.toastr.error('An error occurred while uploading files.'),
        () => this.spinner.hide()
      );
  }
  //#endregion
}

export class UpdateOrderDefinition {
  definition: string;
  images: UpdateOrderDefinitionImage[];
}

export class UpdateOrderDefinitionImage {
  imageId: string;
  order: number;
}
