import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <div class="my-5">
      <footer class="text-center text-lg-start text-white" style="background-color: #45526e">
        <div class="container p-4 pb-0">
          <section class="">
            <div class="row">
              <div class="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
                <h6 class="text-uppercase mb-4 font-weight-bold">Company name</h6>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi sint aliquid excepturi vero, perferendis atque.</p>
              </div>

              <hr class="w-100 clearfix d-md-none" />

              <div class="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
                <h6 class="text-uppercase mb-4 font-weight-bold">Products</h6>
                <p>
                  <a class="text-white">Lorem, ipsum dolor. </a>
                </p>
                <p>
                  <a class="text-white">Lorem, ipsum dolor.</a>
                </p>
                <p>
                  <a class="text-white">Lorem, ipsum dolor.</a>
                </p>
                <p>
                  <a class="text-white">Lorem, ipsum dolor.</a>
                </p>
              </div>

              <hr class="w-100 clearfix d-md-none" />

              <div class="col-md-3 col-lg-2 col-xl-2 mx-auto mt-3">
                <h6 class="text-uppercase mb-4 font-weight-bold">Useful links</h6>
                <p>
                  <a class="text-white">Your Account</a>
                </p>
                <p>
                  <a class="text-white">Become an Affiliate</a>
                </p>
                <p>
                  <a class="text-white">Shipping Rates</a>
                </p>
                <p>
                  <a class="text-white">Help</a>
                </p>
              </div>

              <hr class="w-100 clearfix d-md-none" />

              <div class="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
                <h6 class="text-uppercase mb-4 font-weight-bold">Contact</h6>
                <p><i class="fas fa-home mr-3"></i> Adress</p>
                <p><i class="fas fa-envelope mr-3"></i> Email</p>
                <p><i class="fas fa-phone mr-3"></i> Tel:</p>
                <p><i class="fas fa-print mr-3"></i> Tel:</p>
              </div>
            </div>
          </section>

          <hr class="my-3" />

          <section class="p-3 pt-0">
            <div class="row d-flex align-items-center">
              <div class="col-md-7 col-lg-8 text-center text-md-start">
                <div class="p-3">
                  © 2020 Copyright:
                  <a class="text-white">Lorem, ipsum dolor. </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </footer>
    </div>
  `,
})
export class FooterComponent {}
