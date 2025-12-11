import { UpperCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-first-name',
  imports: [FormsModule, UpperCasePipe],
  templateUrl: './first-name.html',
  styleUrl: './first-name.scss',
})
export class FirstName {
  firstName: string = '';

  newFirstName = '';

  @Input() firstNameAvailables: string[] = [];
  public changeFirstName(newName: string): void {
    this.firstName = newName;
  }

  public addFirstName(firstName: string): void {
    if (!firstName) {
      return;
    }

    const isUnique = !this.firstNameAvailables.includes(firstName);
    if (isUnique) {
      this.firstNameAvailables = [...this.firstNameAvailables, firstName];
      this.newFirstName = '';
    }
  }

  ngOnInit(): void {
    if (this.firstNameAvailables.length > 0) {
      this.firstName = this.firstNameAvailables[0];
    }
  }
}
