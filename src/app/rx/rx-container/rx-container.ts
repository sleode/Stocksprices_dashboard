import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable, of, Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-rx-container',
  imports: [CommonModule],
  templateUrl: './rx-container.html',
  styleUrl: './rx-container.scss',
})
export class RxContainer {
  res$: Observable<number> = of(42);

  timer$ = timer(0, 1000);

  timer = 0;

  obs1: Subscription | undefined;
  obs2: Subscription | undefined;

  ngOnInit(): void {
    this.obs1 = this.res$.subscribe((value) => {
      console.log('Received value from observable:', value);
    });

    this.timer$.subscribe((value) => {
      console.log('Timer tick:', value);
      this.timer = value;
    });
  }

  ngOnDestroy(): void {
    this.obs1?.unsubscribe();
    this.obs2?.unsubscribe();
  }
}
