import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GeolocationService } from '../geolocation.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  private locationSubscription: Subscription;
  public latitude: number;
  public longitude: number;

  constructor(private geolocationService: GeolocationService) { }


  ngOnInit(): void {

    this.locationSubscription = this.geolocationService.getPosition().subscribe(
      location => {
        console.log(location);
        this.latitude = location.coords.latitude;
        this.longitude = location.coords.longitude;
      }
    );
  }


  ngOnDestroy(): void {
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
    }
  }
}
