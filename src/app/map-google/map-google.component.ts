
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Subscription } from 'rxjs';
import { AlertingService } from '../alerting.service';
import { GeolocationService } from '../geolocation.service';

interface MarkerModel {
  options: google.maps.MarkerOptions;
  infoHeader: string;
  info: string;
}

@Component({
  selector: 'app-map-google',
  templateUrl: './map-google.component.html',
  styleUrls: ['./map-google.component.scss']
})
export class MapGoogleComponent implements OnInit, OnDestroy {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow;

  public options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 15,
    minZoom: 8,
  };
  public center: google.maps.LatLngLiteral;
  public markers: MarkerModel[] = [];

  public userMarker: MarkerModel;

  public infoHeader: string;
  public infoContent: string;

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
        this.userMarker = this.buildMarkerModel(location.coords.latitude, location.coords.longitude, 'You', 'You are here');
      },
      err => {
        this.alertingService.error(err);
      }
    );

    this.addMarker(51.648117501274456, -0.15994922688939106, 'Fox Den', 'Visit the foxes, bring food!');
    this.addMarker(51.645080623080155, -0.16374454142504222, 'ALDI', 'Buy food here for the foxes.');
  }

  private buildMarkerModel(latitude: number, longitude: number, label: string, info: string): MarkerModel {
    return {
      options:       {
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
        },
        infoHeader: label,
        info: info
      };
  }

  private addMarker(latitude: number, longitude: number, label: string, info: string): void {
    this.markers.push(this.buildMarkerModel(latitude, longitude, label, info));
  }

  public openInfo(marker: MapMarker, model: MarkerModel) {
    this.infoHeader = model.infoHeader;
    this.infoContent = model.info;
    this.infoWindow.open(marker);
  }

  ngOnDestroy(): void {
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
      this.geolocationService.stopWatching();
    }
  }
}
