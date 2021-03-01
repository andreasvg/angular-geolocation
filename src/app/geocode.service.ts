import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeocodeService {

  constructor() { }

  /* -------------------------------------------------------------------------------------
  Converts the given address string to a LatLngLiteral, using Google API
  ------------------------------------------------------------------------------------- */
  public getAddressPosition(address: string): Observable<google.maps.LatLngLiteral> {
    const geocoder = new google.maps.Geocoder();

    const stream$: Observable<google.maps.LatLngLiteral> =  new Observable<google.maps.LatLngLiteral>((subscriber) => {

      geocoder.geocode({'address': address}, (results, status) => {
        switch (status) {
          case google.maps.GeocoderStatus.OK:
            if (results[0]) {
              const position = {
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng()
              };

              subscriber.next(position);
              subscriber.complete();
            } else {
              subscriber.error('No geocode result returned');
            }

            break;
          default:
            subscriber.error('Something went wrong');
        }

      }
      );

    });

    return stream$;
  }

}
