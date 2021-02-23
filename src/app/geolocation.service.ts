import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

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
  private positionSubject: ReplaySubject<Position> = new ReplaySubject<Position>(1);
  private positionStream$: Observable<Position> = this.positionSubject.asObservable();

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

  public get positionWatchIsActive(): boolean {
    return (this.watchId > 0);
  }

  public startWatching(): Observable<Position> {

    if (this.positionWatchIsActive) {
      console.log('returning existing stream');
      return this.positionStream$;
    } else {

      console.log('creating new stream');

      const stream$: Observable<Position> =  new Observable<Position>((subscriber) => {

        this.watchId = navigator.geolocation.watchPosition(
          location =>  {
            console.log('item returned from geolocation');
            // possibly call some cleanup code here to check if we still have observers...

            subscriber.next(location);
          },
          err => {
            this.watchId = null;
            subscriber.error(this.locationError(err));
          },
          this.geoOptions
        );

        return () => {};

      });

      stream$.subscribe(this.positionSubject);  // proxy via the subject to multicast
      return this.positionStream$;

    }

  }

  public stopWatching(): void {
    if (this.watchId) {
      console.log(this.positionSubject.observers.length);

      if (this.positionSubject.observers.length === 0) {
        // tear down if no more observers are watching
        console.log('tearing down');
        navigator.geolocation.clearWatch(this.watchId);
        this.watchId = null;
      }

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
