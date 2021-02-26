
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
    maxZoom: 19,
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
    const bounds = new google.maps.LatLngBounds();
    let boundsSet: boolean = false;

    this.addMarkers();

    // subscribe to user location changes
    this.locationSubscription = this.geolocationService.startWatching().subscribe(
      location => {

        this.userMarker = this.buildUserMarker(location.coords.latitude, location.coords.longitude);

        if (!boundsSet) {
          this.centerMap(location.coords.latitude, location.coords.longitude);
          bounds.extend(this.userMarker.options.position);

          boundsSet = true;
          setTimeout(() => {
            this.map.fitBounds(bounds);
          }, 100);
        }

      },
      err => {
        this.alertingService.error(err);
      }
    );

    // extend bounds to include all markers:
    this.markers.forEach(m => bounds.extend(m.options.position));
  }

  private buildUserMarker(lat: number, long: number): MarkerModel {
    const marker = this.buildMarkerModel(lat, long, ' ', 'Nici is here', 'assets/giraffe_icon_56.png');
    marker.options.animation = null;
    return marker;
  }

  private addMarkers(): void {
    // this.markers.push(this.buildMarkerModel(51.648117501274456, -0.15994922688939106, 'Fox Den', 'Visit the foxes, bring food!'));
    this.markers.push(this.buildMarkerModel(51.645080623080155, -0.16374454142504222, 'ALDI', 'Buy food here for the foxes.'));
    this.markers.push(this.buildMarkerModel(51.66095496985717, -0.19316448875380993, ' ', 'Monken Hadley.', 'assets/monkey_icon_56.png'));
    //this.markers.push(this.buildMarkerModel(51.67465111435978, -0.18209131908956167, ' ', 'Pigs.', 'assets/pig_icon_56.png'));
  }

  private centerMap(lat: number, long: number): void {
    this.center = {
      lat: lat,
      lng: long,
    };
  }

  private buildMarkerModel(latitude: number, longitude: number, label: string, info: string, icon?: string): MarkerModel {
    const model: MarkerModel = {
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

    if (icon) {
      model.options.icon = icon;
    }

    return model;
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
