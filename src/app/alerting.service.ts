import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AlertingService {

  constructor(
    private snackBar: MatSnackBar) { }

  success(message: string): void {
    this.openSnackBar(message, 'snackbar-success');
  }

  warning(message: string): void {
    this.openSnackBar(message, 'snackbar-warning');
  }

  error(message: string, error: Error = null): void {
    this.openSnackBar(message, 'snackbar-error');
  }

  info(message: string): void {
    this.openSnackBar(message, 'snackbar-info');
  }

  private openSnackBar(message: string, panelClass: string) {
    const horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    const verticalPosition: MatSnackBarVerticalPosition = 'top';

    this.snackBar.open(message, '', {
      duration: 4000,
      panelClass: [panelClass],
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition
    });
  }
}
