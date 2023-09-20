import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ReceiveFunctions } from 'src/app/constants/receive-functions';
import { HubUrlsService } from 'src/app/services/common/hub-urls.service';
import { SignalRService } from 'src/app/services/common/signal-r.service';

@Component({
  selector: 'app-dashboard',
  template: `<p style="margin-bottom: 500px;">DashboardComponent</p>`,
})
export class DashboardComponent implements OnInit {
  constructor(private signalRService: SignalRService, private toastr: ToastrService, private hubUrlsService: HubUrlsService, @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      signalRService.start(hubUrlsService.OrderHub);
      signalRService.start(hubUrlsService.ProductHub);
    }
  }
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.signalRService.on(this.hubUrlsService.ProductHub, ReceiveFunctions.ProductAddedMessageReceiveFunction, (message) => {
        this.toastr.info(message);
      });
      this.signalRService.on(this.hubUrlsService.OrderHub, ReceiveFunctions.OrderAddedMessageReceiveFunction, (message) => {
        this.toastr.info(message);
      });
    }
  }
}
