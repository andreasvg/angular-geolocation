import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertingService } from '../alerting.service';
import { GeolocationService } from '../geolocation.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  public watchingActive: boolean = false;
  private locationSubscription: Subscription;
  public latitude: number;
  public longitude: number;
  public timestamp: number;
  public accuracy: number;
  public altitude: number;
  public altitudeAccuracy: number;
  public heading: number;
  public speed: number;

  constructor(private geolocationService: GeolocationService, private alertingService: AlertingService) { }


  ngOnInit(): void {
    // this.locationSubscription = this.geolocationService.getPosition().subscribe(
    //   location => {
    //     console.log(location);
    //     this.timestamp = location.timestamp;
    //     this.latitude = location.coords.latitude;
    //     this.longitude = location.coords.longitude;
    //     this.accuracy = location.coords.accuracy;
    //     this.altitude = location.coords.altitude;
    //     this.altitudeAccuracy = location.coords.altitudeAccuracy;
    //     this.heading = location.coords.heading;
    //     this.speed = location.coords.speed;
    //   }
    // );
  }

  public onStartWatchingClick(): void {
    this.watchingActive = true;
    this.alertingService.info('Watching location changes...');

    this.locationSubscription = this.geolocationService.startWatching().subscribe(
      location => {
        console.log(location);
        this.timestamp = location.timestamp;
        this.latitude = location.coords.latitude;
        this.longitude = location.coords.longitude;
        this.accuracy = location.coords.accuracy;
        this.altitude = location.coords.altitude;
        this.altitudeAccuracy = location.coords.altitudeAccuracy;
        this.heading = location.coords.heading;
        this.speed = location.coords.speed;
      },
      err => {
        this.watchingActive = false;
        this.alertingService.error(err);
      }
    );

  }

  public onStopWatchingClick(): void {
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
    }

    this.watchingActive = false;
    this.geolocationService.stopWatching();
    this.alertingService.info('Stopped watching location changes');
  }

  ngOnDestroy(): void {
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
    }
  }
}
