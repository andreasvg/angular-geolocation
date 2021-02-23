import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  declarations: [],
  imports: [ CommonModule, MatToolbarModule, MatMenuModule, MatIconModule, MatTableModule, MatSelectModule,
    MatOptionModule, MatFormFieldModule, MatExpansionModule, MatCardModule, MatButtonModule, MatButtonToggleModule,
    MatTabsModule, MatProgressSpinnerModule, MatSidenavModule, MatInputModule, MatDividerModule, MatCheckboxModule,
    MatSliderModule, MatTooltipModule, MatRadioModule, MatStepperModule, MatDialogModule, MatAutocompleteModule,
    MatListModule, MatChipsModule, MatRippleModule, MatSnackBarModule, MatSortModule  ],

  exports: [MatToolbarModule, MatMenuModule, MatIconModule, MatTableModule, MatSelectModule,
    MatOptionModule, MatFormFieldModule, MatExpansionModule, MatCardModule, MatButtonModule, MatButtonToggleModule,
    MatTabsModule, MatProgressSpinnerModule, MatSidenavModule, MatInputModule,MatDividerModule, MatCheckboxModule,
    MatSliderModule, MatTooltipModule, MatRadioModule, MatStepperModule, MatDialogModule, MatAutocompleteModule,
    MatListModule, MatChipsModule, MatRippleModule, MatSnackBarModule, MatSortModule],
})
export class MaterialModule { }
