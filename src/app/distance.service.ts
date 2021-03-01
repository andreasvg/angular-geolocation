import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDistanceModel } from './models/IDistanceModel';

@Injectable({
  providedIn: 'root'
})
export class DistanceService {

  /* -------------------------------------------------------------------------------------
  Calculates distances for the given destinations from the given origin, using Google API
  ------------------------------------------------------------------------------------- */
  public calculateDistances(origin: google.maps.LatLngLiteral,
                            destinations: string[] | google.maps.LatLngLiteral[],
                            travelMode: google.maps.TravelMode): Observable<IDistanceModel[]> {
    const svc = new google.maps.DistanceMatrixService();

    const stream$ = new Observable<IDistanceModel[]>(subscriber => {

      svc.getDistanceMatrix({
        origins: [origin],
        destinations: destinations,
        travelMode: travelMode
      }, (response, status ) => {

        switch (status) {
          case google.maps.DistanceMatrixStatus.OK:
            subscriber.next(this.buildResponseArray(response.rows[0], destinations));
            subscriber.complete();
            break;

          default:
            subscriber.error('An error occurred while resolving distances');
            break;
        }

      });

    });

    return stream$;
  }

  private buildResponseArray(row: google.maps.DistanceMatrixResponseRow,
                            destinations: string[] | google.maps.LatLngLiteral[]): IDistanceModel[] {
    const retVal: IDistanceModel[] = [];

    for(let i in row.elements) {
      retVal.push({
        destination: destinations[i],
        distance: row.elements[i].distance,
        duration: row.elements[i].duration
      });
    }

    return retVal;
  }

}
