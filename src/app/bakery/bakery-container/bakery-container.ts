import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { combineLatest, map, scan, share, timer } from 'rxjs';

const COST_PAIN_AU_CHOCOLAT = 1.5;
const COST_CROISSANT = 1.2;

@Component({
  selector: 'app-bakery-container',
  imports: [CommonModule],
  templateUrl: './bakery-container.html',
  styleUrl: './bakery-container.scss',
})
export class BakeryContainer {
  painAuChocolatFatoryTimer = timer(0, 2000).pipe(share());
  croissantFatoryTimer = timer(0, 3000).pipe(share());

  customerFactoryTimer = timer(0, 7000).pipe(share());

  customerCounterInstant$ = this.customerFactoryTimer.pipe(
    // Logic to create customers
    map((timer) => 1), // this.getNumberBetween(1, 5) * timer),
    share()
  );

  customerCounterTotal$ = this.customerCounterInstant$.pipe(
    // Logic to accumulate customers
    scan((acc, curr) => acc + curr, 0),
    share()
  );

  painAuChocolatCreated$ = this.painAuChocolatFatoryTimer.pipe(
    // Logic to create pain au chocolat
    map((timer) => 3 * timer)
  );

  treasuryPainAuChocolatCreated$ = this.painAuChocolatCreated$.pipe(
    // Logic to add to treasury
    map((created) => created * COST_PAIN_AU_CHOCOLAT)
  );

  croissantCreated$ = this.croissantFatoryTimer.pipe(
    // Logic to create croissant
    map((timer) => 4 * timer)
  );

  treasuryCroissantCreated$ = this.croissantCreated$.pipe(
    // Logic to add to treasury
    map((created) => created * COST_CROISSANT)
  );

  // nombre de pains aux chocolat vendus
  soldPainAuChocolat$ = this.customerCounterInstant$.pipe(
    map((customers) => customers * this.getNumberBetween(1, 3)),
    share()
  );

  // nombre de pains aux chocolat totals vendus
  totalSoldPainAuChocolat$ = this.soldPainAuChocolat$.pipe(scan((acc, curr) => acc + curr, 0));

  // nombe de pains aux chocolat en stocks
  stockPainAuChocolatRemaining$ = combineLatest([
    this.painAuChocolatCreated$,
    this.totalSoldPainAuChocolat$,
  ]).pipe(map(([created, sold]) => created - sold));

  public getNumberBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
