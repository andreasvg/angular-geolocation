export interface IDistanceModel {
  destination: string | google.maps.LatLngLiteral;
  distance: google.maps.Distance;
  duration: google.maps.Duration;
}
