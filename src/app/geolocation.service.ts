import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  private geoOptions = {
    enableHighAccuracy: true, // enable if available
    timeout: 10000,           // 10 seconds
    maximumAce: 300000        // only accept cached positions with this max
  };

  private watchId: number;

  public getPosition(): Observable<Position> {

    return new Observable<Position>((subscriber) => {

      navigator.geolocation.getCurrentPosition(
        location =>  {
          subscriber.next(location);
          subscriber.complete();
        },
        err => subscriber.error(this.locationError(err)),
        this.geoOptions
      );

    });

  }

  public startWatching(): Observable<Position> {

    return new Observable<Position>((subscriber) => {

      this.watchId = navigator.geolocation.watchPosition(
        location =>  {
          subscriber.next(location);
        },
        err => subscriber.error(this.locationError(err)),
        this.geoOptions
      );

      return () => {
        console.log('about to tear down');
        this.stopWatching();
      }

    }).pipe(
      share()
    );

  }

  private stopWatching(): void {
    if (this.watchId) {
      console.log('tearing down');
      navigator.geolocation.clearWatch(this.watchId);
    }
  }

  private locationError(error) {
    let msg = "";

    console.log("error.message = " + error.message);
    switch (error.code) {
      case error.PERMISSION_DENIED:
        msg = "User does not want to display their location.";
        break;
      case error.POSITION_UNAVAILABLE:
        msg = "Can't determine user's location.";
        break;
      case error.TIMEOUT:
        msg = "The request for geolocation information timed out.";
        break;
      case error.UNKNOWN_ERROR:
        msg = "An unknown error occurred.";
        break;
    }

    return msg;
  }


}
