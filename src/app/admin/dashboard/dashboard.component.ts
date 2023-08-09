import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ReceiveFunctions } from 'src/app/constants/receive-functions';
import { HubUrlsService } from 'src/app/services/common/hub-urls.service';
import { SignalRService } from 'src/app/services/common/signal-r.service';

@Component({
  selector: 'app-dashboard',
  template: `<p>DashboardComponent</p>`,
})
export class DashboardComponent implements OnInit {
  constructor(private signalRService: SignalRService, private toastr: ToastrService, private hubUrlsService: HubUrlsService) {
    signalRService.start(hubUrlsService.OrderHub);
    signalRService.start(hubUrlsService.ProductHub);
  }
  ngOnInit(): void {
    this.signalRService.on(this.hubUrlsService.ProductHub, ReceiveFunctions.ProductAddedMessageReceiveFunction, (message) => {
      this.toastr.info(message);
    });
    this.signalRService.on(this.hubUrlsService.OrderHub, ReceiveFunctions.OrderAddedMessageReceiveFunction, (message) => {
      this.toastr.info(message);
    });
  }
}
