
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, GoogleMapsModule, MapMarker } from '@angular/google-maps';
import { Observable, Subscription } from 'rxjs';
import { AlertingService } from '../alerting.service';
import { GeolocationService } from '../geolocation.service';

@Component({
  selector: 'app-map-google',
  templateUrl: './map-google.component.html',
  styleUrls: ['./map-google.component.scss']
})
export class MapGoogleComponent implements OnInit, OnDestroy {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;

  public options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 15,
    minZoom: 8,
  };
  public center: google.maps.LatLngLiteral;
  public markers: google.maps.MarkerOptions[] = [];
  private locationSubscription: Subscription;

  constructor(private geolocationService: GeolocationService,
              private alertingService: AlertingService) { }

  ngOnInit(): void {
    this.locationSubscription = this.geolocationService.startWatching().subscribe(
      location => {
        this.center = {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        };
      },
      err => {
        this.alertingService.error(err);
      }
    );

    this.addMarker(51.648117501274456, -0.15994922688939106, 'Fox Den');
    this.addMarker(51.645080623080155, -0.16374454142504222, 'ALDI');
  }

  private addMarker(latitude: number, longitude: number, label: string): void {

    this.markers.push({
      animation: google.maps.Animation.DROP,
      position: {
        lat: latitude,
        lng: longitude
      },
      label: {
        color: 'black',
        text: label,
      },
      title: label
    });
  }

  ngOnDestroy(): void {
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
      this.geolocationService.stopWatching();
    }
  }
}
