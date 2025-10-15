import {Component, computed, signal} from '@angular/core';
import {MatError, MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {KeyValuePipe, NgClass} from '@angular/common';
import {MatBadge} from "@angular/material/badge";

@Component({
  selector: 'app-generator',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    MatButton,
    FormsModule,
    MatCard,
    MatCardTitle,
    KeyValuePipe,
    MatError,
    MatCardContent,
    MatBadge,
    NgClass
  ],
  templateUrl: './generator.component.html',
  styleUrl: './generator.component.css'
})
export class GeneratorComponent {


  numbers = new Array<number>(16);
  numbersGenerated = signal<number[]>([]);
  missingFields = false;
  duplicateNumbers = false;
  outOfRangeNumbers = false;
  printReference = true;
  choice = signal<number>(99);
  isInverted = signal<boolean>(false)

  pairs: Map<number, Array<number>> = new Map([
    [1, [9, 10, 11, 12, 13, 14]],
    [2, [9, 10, 11, 12, 13, 14]],
    [3, [9, 10, 11, 12, 13, 14]],
    [4, [9, 10, 11, 12, 13, 14]],
    [5, [9, 10, 11, 12, 13, 14]],
    [6, [9, 10, 11, 12, 13, 14]],
    [7, [9, 10, 11, 12, 13, 14]],
    [8, [9, 10, 11, 12, 13, 14]],
    [9, [10, 11, 12, 13, 14]],
    [10, [11, 12, 13, 14]],
    [11, [12, 13, 14]],
    [12, [13, 14]],
    [13, [14, 15]],
    [14, [15]]
  ]);

  numbersGeneratedInverted = computed(() => {
    return [0, 0, this.numbersGenerated()[12], 0, this.numbersGenerated()[11], 0, this.numbersGenerated()[10],
      0, 0, 0, this.numbersGenerated()[6], this.numbersGenerated()[4], this.numbersGenerated()[2], 0, 0, 0];
  });

  public changeNumberChoice(choice: number) {
    this.choice.set(choice);
  }

  public generateGrid() {
    /*if (this.numbersMissing()) {
      this.missingFields = true;
      this.duplicateNumbers = false;
      this.outOfRangeNumbers = false;
    } else*/ if (this.numbersContainDuplicates()) {
      this.missingFields = false;
      this.duplicateNumbers = true;
      this.outOfRangeNumbers = false;
    } else if (this.numbersContainOutOfRange()) {
      this.outOfRangeNumbers = true;
      this.missingFields = false;
      this.duplicateNumbers = false;
    } else {
      this.missingFields = false;
      this.duplicateNumbers = false;
      this.numbersGenerated.set([...this.numbers]);
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

  public printListCards(withReference: boolean) {
    this.printReference = withReference;
    setTimeout(() => {
      window.print();
    }, 1000)
    setTimeout(() => {
      this.printReference = true;
    }, 2000)
  }

  public invert() {
    const tab = [...this.numbersGenerated()];
    tab[2] = this.numbersGeneratedInverted()[2];
    tab[4] = this.numbersGeneratedInverted()[4];
    tab[6] = this.numbersGeneratedInverted()[6];

    tab[10] = this.numbersGeneratedInverted()[10];
    tab[11] = this.numbersGeneratedInverted()[11];
    tab[12] = this.numbersGeneratedInverted()[12];

    this.numbers = tab;
    this.generateGrid();
    this.isInverted.update((value) => !value);
  }
}
