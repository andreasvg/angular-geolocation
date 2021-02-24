import {Map, View, Feature} from 'ol';
import { fromLonLat } from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import { Point } from 'ol/geom';
import { Vector as layerVector } from 'ol/layer';
import { Vector as sourceVector} from 'ol/source';
import OSM from 'ol/source/OSM';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GeolocationService } from '../geolocation.service';

@Component({
  selector: 'app-map-open-layers',
  templateUrl: './map-open-layers.component.html',
  styleUrls: ['./map-open-layers.component.scss']
})
export class MapOpenLayersComponent implements OnInit, OnDestroy {
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

  public map: Map;

  constructor(private geolocationService: GeolocationService) { }

  ngOnInit(): void {
    this.locationSubscription = this.geolocationService.getPosition().subscribe(
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

        this.buildMap();
        //this.drawMarker();
      }
    );
  }

  private buildMap(): void {
    this.map = new Map({
      latitude: this.latitude,
      longitude: this.longitude,
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat([this.longitude, this.latitude]),
        zoom: 16
      })
    });

  }

  // private drawMarker(): void {
  //   const longLat = fromLonLat([this.longitude, this.latitude]);

  //   const layer = new layerVector({
  //     source: new sourceVector({
  //       features: [
  //         new Feature({
  //           geometry: new Point(longLat)
  //         })
  //       ]
  //     })
  //   });

  //   this.map.addLayer(layer);
  //   console.log(layer);
  //   console.log('added layer');
  //   console.log(this.map);
  // }

  ngOnDestroy(): void {
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
    }
  }
}
