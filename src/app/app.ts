import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BakeryContainer } from './bakery/bakery-container/bakery-container';
import { Alert } from './features/alert/alert';
import { FirstName } from './features/first-name/first-name';
import { RxContainer } from './rx/rx-container/rx-container';
import { List } from './starwars/list/list';
import { Container } from './yoloGame/container/container';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Alert, FirstName, Container, RxContainer, BakeryContainer, List],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('project 123');

  availableNames = ['PureCss', 'Angular', 'React', 'Vue', 'Svelte'];

  onalertclicked(number: number): void {
    console.log(`Alert clicked ${number} times`);
  }
}
