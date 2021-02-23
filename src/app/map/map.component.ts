import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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

  constructor(private geolocationService: GeolocationService) { }


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
      }
    );
    this.watchingActive = true;
  }

  public onStopWatchingClick(): void {
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
    }

    this.watchingActive = false;
    this.geolocationService.stopWatching();

  }

  ngOnDestroy(): void {
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
    }
  }
}
