import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  public getPosition(): Observable<Position> {

    return new Observable<Position>((subscriber) => {

      navigator.geolocation.getCurrentPosition(
        location =>  {
          subscriber.next(location);
          subscriber.complete();
        },
        err => subscriber.error(err)
      );

    });

  }
}
