import { Component } from '@angular/core';
import { Display } from '../display/display';

@Component({
  selector: 'app-container',
  imports: [Display],
  templateUrl: './container.html',
  styleUrl: './container.scss',
})
export class Container {
  counter: number = 0;

  public incrementCounter(): void {
    this.counter++;
  }

  public decrementCounter(): void {
    this.counter--;
  }
}
