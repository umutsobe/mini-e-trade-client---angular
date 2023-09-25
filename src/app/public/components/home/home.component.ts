import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Image } from 'src/app/contracts/product/image';
import { FileService } from 'src/app/services/models/file.service';
import { ImageService } from 'src/app/services/models/image.service';

@Component({
  selector: 'app-home',
  template: `
    <div class="container-sm" style="margin-bottom: 500px;">
      <div class="">
        <!-- carouselTop -->
        <div id="carouselTop" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-inner w-100">
            <div *ngFor="let image of homePageImages; let isFirst = first" class="carousel-item rounded-2" [class.active]="isFirst">
              <img class="carousel-image w-100" height="300" alt="{{ image.fileName }}" [lazyLoad]="baseUrl + '/' + image.path" [defaultImage]="defaultImage" />
            </div>
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#carouselTop" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#carouselTop" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      <!-- card slider -->
    </div>
  `,
  styles: [
    `
      .carousel-image {
        object-fit: cover;
      }
    `,
  ],
})
export class HomeComponent implements OnInit {
  constructor(private imageService: ImageService, private fileService: FileService, @Inject(PLATFORM_ID) private platformId: Object) {}
  homePageImages: Image[] = [];
  baseUrl: string = '';
  defaultImage = '/assets/preload.png';
  isBrowser = false;

  async ngOnInit() {
    this.isBrowser = isPlatformBrowser(this.platformId); //search prerender iyi çalışmıyor

    this.homePageImages = await this.imageService.getImagesByDefinition('home');
    this.baseUrl = (await this.fileService.getBaseStorageUrl()).url;
    console.log(this.baseUrl);
  }
}
