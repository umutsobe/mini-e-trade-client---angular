import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Image } from 'src/app/contracts/product/image';
import { FileService } from 'src/app/services/models/file.service';
import { ImageService } from 'src/app/services/models/image.service';

@Component({
  selector: 'app-images',
  template: `
    <div>
      <section>
        <h2>Home Page Images</h2>
        <p class="fw-bolder" style="color: green;">Tip: You can sort the photos by dragging and dropping</p>
        <!-- images -->
        <div class="list-images">
          <div cdkDropList cdkDropListOrientation="horizontal" class="example-list d-flex pb-5" (cdkDropListDropped)="drop($event)">
            <div style="cursor: move;" *ngFor="let homePageImage of homePageImages" cdkDrag>
              <div style="" class="card m-1 p-3">
                <div style="cursor: move !important;">
                  <p-image src="{{ baseUrl }}/{{ homePageImage.path }}" class="d-flex justify-content-center" alt="{{ homePageImage.fileName }}" height="200" [preview]="true"></p-image>
                </div>
                <div class="m-1 d-flex justify-content-center" style="width: 100%;">
                  <button (click)="deleteHomePageImage(homePageImage.id)" class=" btn btn-danger">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="my-3" style="width: 250px">
          <app-file-upload [definition]="definition"></app-file-upload>
        </div>
      </section>
      <div *ngFor="let homePageImage of homePageImages">
        {{ homePageImage.path }}
      </div>
    </div>
  `,
  styles: [
    `
      .example-list {
        overflow-x: auto;
      }

      .cdk-drag-preview {
        box-sizing: border-box;
        border-radius: 4px;
        box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
      }

      .cdk-drag-placeholder {
        opacity: 0;
      }

      .cdk-drag-animating {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }

      .example-box:last-child {
        border: none;
      }

      .example-list.cdk-drop-list-dragging .example-box:not(.cdk-drag-placeholder) {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }
    `,
  ],
})
export class ImageControlComponent implements OnInit, AfterViewChecked {
  homePageImages: Image[];
  definition = 'home';
  baseUrl: string = '';

  constructor(private imageService: ImageService, private toastr: ToastrService, private spinner: NgxSpinnerService, private fileService: FileService) {}
  ngAfterViewChecked(): void {}

  async ngOnInit() {
    this.baseUrl = (await this.fileService.getBaseStorageUrl()).url;
    this.getHomePageImages();
  }
  async getHomePageImages() {
    this.homePageImages = await this.imageService.getImagesByDefinition('home');
  }

  deleteHomePageImage(id) {
    this.imageService.deleteImage(id);
    this.getHomePageImages();
  }
  refresh() {
    this.getHomePageImages();
  }

  //drag and drop sorting

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.homePageImages, event.previousIndex, event.currentIndex);
  }
}
