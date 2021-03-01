
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Observable, Subscription } from 'rxjs';
import { AlertingService } from '../alerting.service';
import { DistanceService } from '../distance.service';
import { GeocodeService } from '../geocode.service';
import { GeolocationService } from '../geolocation.service';
import { IDistanceModel } from '../models/IDistanceModel';

interface MarkerModel {
  options: google.maps.MarkerOptions;
  infoHeader: string;
  info: string;
}

interface IFence {
  north: number,
  east: number,
  south: number,
  west: number
}

@Component({
  selector: 'app-map-google',
  templateUrl: './map-google.component.html',
  styleUrls: ['./map-google.component.scss']
})
export class MapGoogleComponent implements OnInit, OnDestroy {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow;
  @ViewChild('directionsPanel', { static: false }) directionsPanel: ElementRef;

  public options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    mapTypeControl: false,
    scrollwheel: false,
    scaleControl: true,
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

  private fenceArea = null;
  private fenceMeters: IFence = {
    north: 2500,
    east: 1000,
    south: 1500,
    west: 2700
  };

  private foxDenLatitude: number = 51.648117501274456;
  private foxDenLongitude: number = -0.15994922688939106;

  constructor(private geolocationService: GeolocationService,
              private geocodeService: GeocodeService,
              private distanceService: DistanceService,
              private alertingService: AlertingService) { }

  ngOnInit(): void {
    const bounds = new google.maps.LatLngBounds();
    let boundsSet: boolean = false;

    this.addMarkers();
    setTimeout(() => this.drawFence(this.foxDenLatitude, this.foxDenLongitude), 3000);  // allow time for geometry library to load

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

          this.determineDistances();
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

  private drawFence(lat: number, long: number): void {
    let bounds = this.createFenceBounds(new google.maps.LatLng(lat, long), this.fenceMeters);

    this.fenceArea = new google.maps.Rectangle({
      map: this.map.googleMap,
      bounds: bounds,
      strokeColor: 'red',
      strokeWeight: 2,
      fillOpacity: 0
    });

    this.map.fitBounds(bounds);
  }

  // Note: north = 0, east = 90, south = 180, west = -90
  private createFenceBounds(point: google.maps.LatLng, fence: IFence): google.maps.LatLngBounds {
    // shorten the function name
    let computeOffset = google.maps.geometry.spherical.computeOffset;

    // make a new point north
    const n = computeOffset(point, fence.north, 0);

    // make a new point northeast
    const ne = computeOffset(n, fence.east, 90);

    // make a new point south
    const s = computeOffset(point, fence.south, 180);

    // make a new point south-west
    const sw = computeOffset(s, fence.west, -90);

    return new google.maps.LatLngBounds(sw, ne);
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
    this.checkFenceBounds(to);
    this.renderDirections(from, to);
  }

  public showDirectionsAldi(): void {
    const aldi = this.markers.find(m => m.infoHeader ==='ALDI');
    const from = this.userMarker.options.position as google.maps.LatLngLiteral;
    const to = aldi.options.position as google.maps.LatLngLiteral;
    this.checkFenceBounds(to);
    this.renderDirections(from, to);
  }

  public showDirectionsOldHouse(): void {
    const from = this.userMarker.options.position as google.maps.LatLngLiteral;
    const to = '19 Thornfield Avenue, NW7 1LT';
    let pos: google.maps.LatLngLiteral;

    this.geocodeService.getAddressPosition(to).subscribe(p => {
      this.renderDirections(from, p);
      pos = p;
    });

    setTimeout(() => this.checkFenceBounds(pos), 200);
  }

  /* -------------------------------------------------------------------------------------
  Shows a warning if the given position is outside the fence area
  ------------------------------------------------------------------------------------- */
  private checkFenceBounds(position: google.maps.LatLngLiteral): void {
    if (!this.fenceArea.getBounds().contains(position)) {
      this.alertingService.warning('This is far Nici, go with Mohackel');
    }
  }

  /* -------------------------------------------------------------------------------------
  Renders directions on the map
  ------------------------------------------------------------------------------------- */
  private renderDirections(from: google.maps.LatLngLiteral, to: google.maps.LatLngLiteral): void {
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
    );
  }

  /* -------------------------------------------------------------------------------------
  Example of how to use the Distance Service
  ------------------------------------------------------------------------------------- */
  private determineDistances(): void {
    const destinations: string[] = [
      '19 Thornfield Avenue, NW7 1LT',
      'Hadley Green Road, Barnet',
      '30 Brookhill Rd, East Barnet, London, Barnet EN4 8SL'
    ];
    const origin = this.userMarker.options.position;

    this.distanceService.calculateDistances(origin as google.maps.LatLngLiteral, destinations, google.maps.TravelMode.WALKING)
        .subscribe((distances: IDistanceModel[]) => console.log(distances));
  }

  ngOnDestroy(): void {
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
      this.geolocationService.stopWatching();
    }
  }
}
