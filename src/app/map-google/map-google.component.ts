
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
  //@ViewChild(GoogleMap, { static: false }) map: google.maps.Map;
  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow;
  @ViewChild('directionsPanel', { static: false }) directionsPanel: ElementRef;

  public options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    mapTypeControl: false,
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
  private directionsService = new google.maps.DirectionsService();
  private directionsRenderer = new google.maps.DirectionsRenderer();

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
    this.markers.push(this.buildMarkerModel(51.64463166808768, -0.16374454142504222, 'ALDI', 'Buy food here for the foxes.'));
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

  public clearDirections(): void {
    this.directionsRenderer.setMap(null);
    this.directionsRenderer.setPanel(null);
  }

  public showDirectionsMonkey(): void {
    const monkey = this.markers.find(m => m.info ==='Monken Hadley.');
    const from = this.userMarker.options.position as google.maps.LatLngLiteral;
    const to = monkey.options.position as google.maps.LatLngLiteral;
    this.getDirections(from, to);
  }

  public showDirectionsAldi(): void {
    const aldi = this.markers.find(m => m.infoHeader ==='ALDI');
    const from = this.userMarker.options.position as google.maps.LatLngLiteral;
    const to = aldi.options.position as google.maps.LatLngLiteral;
    this.getDirections(from, to);
  }

  public showDirectionsOldHouse(): void {
    const from = this.userMarker.options.position as google.maps.LatLngLiteral;
    const to = '19 Thornfield Avenue, NW7 1LT';
    this.getDirections(from, to);
  }

  private getDirections(from: google.maps.LatLngLiteral, to: google.maps.LatLngLiteral | string): void {
    this.clearDirections();

    this.directionsService.route(
      {
        origin: from,
        destination: to,
        travelMode: google.maps.TravelMode.WALKING,
        avoidHighways: true,
        provideRouteAlternatives: true
      },
      (response, status) => {
        if (status === 'OK') {
          this.directionsRenderer.setDirections(response);

          this.directionsRenderer.setMap(this.map.googleMap);
          this.directionsRenderer.setPanel(this.directionsPanel.nativeElement);
        } else {
          this.alertingService.error(`Directions service failed (${status})`);
        }
      }
    )
  }

  ngOnDestroy(): void {
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
      this.geolocationService.stopWatching();
    }
  }
}
