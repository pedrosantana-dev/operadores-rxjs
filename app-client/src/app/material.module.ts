import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatChipsModule } from "@angular/material/chips";
import { MatInputModule } from "@angular/material/input";
import { MatDialogModule } from "@angular/material/dialog";



@NgModule({
  declarations: [],
  exports: [
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatChipsModule,
    MatInputModule,
    MatDialogModule
  ],
  imports: [
    CommonModule
  ]
})
export class MaterialModule { }
