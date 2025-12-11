import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.html',
  styleUrl: './alert.scss',
})
export class Alert {
  @Input() alertClickedNumber = 0;
  @Output() alertClicked = new EventEmitter<number>();

  public alert(): void {
    window.alert('Alerte déclenchée !');
    this.alertClickedNumber++;
    this.alertClicked.emit(this.alertClickedNumber);
  }

  public isOdd(num: number): boolean {
    return num % 2 !== 0;
  }
}
