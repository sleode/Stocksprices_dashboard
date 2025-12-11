import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-display',
  imports: [],
  templateUrl: './display.html',
  styleUrl: './display.scss',
})
export class Display {
  @Input() counter: number = 0;

  public getArrayFromCounter(): number[] {
    return Array.from({ length: this.counter }, (_, i) => i + 1);
  }
}
