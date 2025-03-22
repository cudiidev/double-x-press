import {Component, computed, signal} from '@angular/core';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
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
    MatCardTitle,
    KeyValuePipe,
    MatError,
    MatCardContent
  ],
  templateUrl: './generator.component.html',
  styleUrl: './generator.component.css'
})
export class GeneratorComponent {

  // TODO en liste en dessous
  // TODO listes configurables

  numbers = new Array<number>(16);
  numbersGenerated = signal<number[]>([]);
  missingFields = false;
  duplicateNumbers = false;
  outOfRangeNumbers = false;
  printReference = true;
  choice = signal<number>(0);

  pairs: Map<number, Array<number>> = new Map([
    [1, [9, 10, 11, 12, 13, 15]],
    [2, [7, 8, 9, 13, 14, 15]],
    [3, [8, 9, 10, 12, 13, 14, 15]],
    [4, [8, 10, 11, 12, 13, 15]],
    [5, [7, 9, 11, 14]],
    [6, [8, 12, 13, 14, 15]],
    [7, [8, 11, 12, 13, 14, 15]],
    [8, [9, 10, 11, 12, 13, 15]],
    [9, [10, 11, 12, 13]],
    [10, [11, 13]],
    [11, [13, 14]],
    [12, [13, 14]],
    [13, [14]],
    [14, [15]]
  ]);

  lineResult = computed(() => {
    const results: string[] = [];
    if (this.numbersGenerated().length === 16) {
      this.pairs.forEach((pair, index) => {
        pair.forEach((num) => {
          results.push(this.numbersGenerated()[index - 1].toString() + this.numbersGenerated()[num - 1].toString());
        })
      })
    }
    return results.join(', ');
  });

  public changeNumberChoice(choice: number) {
    this.choice.set(choice);
  }

  public generateGrid() {
    if (this.numbersMissing()) {
      this.missingFields = true;
      this.duplicateNumbers = false;
      this.outOfRangeNumbers = false;
    } else if (this.numbersContainDuplicates()) {
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
}
