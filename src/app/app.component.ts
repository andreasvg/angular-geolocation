import { Component, OnInit } from '@angular/core';
import { AlertingService } from './alerting.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'angular-geolocation';

  constructor(private alertingService: AlertingService) {

  }

  public showAlert(): void {
    this.alertingService.warning('Test message');
  }
}
