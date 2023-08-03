import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HubUrls } from 'src/app/constants/hub-urls';
import { ReceiveFunctions } from 'src/app/constants/receive-functions';
import { SignalRService } from 'src/app/services/common/signal-r.service';

@Component({
  selector: 'app-dashboard',
  template: `<p>DashboardComponent</p>`,
})
export class DashboardComponent implements OnInit {
  constructor(private signalRService: SignalRService, private toastr: ToastrService) {
    signalRService.start(HubUrls.ProductHub);
  }
  ngOnInit(): void {
    this.signalRService.on(ReceiveFunctions.ProductAddedMessageReceiveFunction, (message) => {
      this.toastr.info(message);
    });
  }
}
