import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <div class="container-sm" style="margin-bottom: 500px;">
      <div class="d-flex flex-column align-items-center">
        <!-- carousel1 -->
        <div id="carousel1" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-inner">
            <div class="carousel-item active">
              <img src="/assets/home1.jpg" class="carousel-image d-block w-100" alt="..." />
            </div>
            <div class="carousel-item">
              <img style="object-fit: cover" src="/assets/home2.jpg" class="d-block w-100" alt="..." />
            </div>
            <div class="carousel-item">
              <img style="object-fit: cover" src="/assets/home3.jpg" class="d-block w-100" alt="..." />
            </div>
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#carousel1" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#carousel1" data-bs-slide="next">
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
        object-fit: contain;
      }
    `,
  ],
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
