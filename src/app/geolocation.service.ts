import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  public getPosition(): Observable<Position> {
    return from(new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(location => {
          resolve(location);
        },

        err => {
          reject(err);
        });

    })) as Observable<Position>;
  }
}
