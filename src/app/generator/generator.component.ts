import {Component} from '@angular/core';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatCard, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {KeyValuePipe} from '@angular/common';

@Component({
  selector: 'app-generator',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
    FormsModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    KeyValuePipe,
    MatError
  ],
  templateUrl: './generator.component.html',
  styleUrl: './generator.component.css'
})
export class GeneratorComponent {

  // TODO en rouge le numéro du dessous
  // TODO en liste en dessous
  // TODO listes configurables

  numbers = new Array<number>(16);
  numbersGenerated: Array<number> = [];
  missingFields = false;
  duplicateNumbers = false;
  outOfRangeNumbers = false;

  pairs: Map<number, Array<number>> = new Map([
    [1, [8, 9, 10, 13, 14, 16]],
    [2, [7, 8, 9, 10, 12, 13]],
    [3, [8, 9, 10, 11, 12, 13, 14]],
    [4, [9, 10, 12, 16]],
    [5, [5, 10, 12, 13]],
    [6, [8, 9, 12, 13, 14]],
    [7, [8, 10, 12]],
    [8, [9, 11, 12, 13, 16]],
    [9, [15, 16]],
    [10, [12, 16]],
    [11, [12, 15]],
    [14, [15, 16]]
  ]);

  public generateGrid() {
    if (this.numbersMissing()) {
      this.missingFields = true;
      this.duplicateNumbers = false;
      this.outOfRangeNumbers = false;
    } else if (this.numbersContainDuplicates()) {
      this.missingFields = false;
      this.duplicateNumbers = true;
      this.outOfRangeNumbers = false;
    } else if(this.numbersContainOutOfRange()) {
      this.outOfRangeNumbers = true;
      this.missingFields = false;
      this.duplicateNumbers = false;
    } else {
      this.missingFields = false;
      this.duplicateNumbers = false;
      this.numbersGenerated = [...this.numbers];
    }
  }

  public updateArray(event: any, index: number) {
    this.numbers[index] = event.target.valueAsNumber;
  }

  public numbersMissing(): boolean {
    return this.numbers.filter(n => !!n)?.length !== 16;
  }

  public numbersContainDuplicates(): boolean {
    let containDuplicate = false;
    this.numbers.forEach((n) => {
      if (this.numbers.filter(n2 => n2 == n)?.length > 1) {
        containDuplicate = true;
      }
    });
    return containDuplicate;
  }

  public numbersContainOutOfRange() {
    let containOutOfRange = false;
    this.numbers.forEach((n) => {
      if (n < 1 || n > 16) {
        containOutOfRange = true;
      }
    });
    return containOutOfRange;
  }
}