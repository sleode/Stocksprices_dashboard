import { CommonModule } from '@angular/common';
import { Component, inject, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  combineLatest,
  map,
  share,
  switchMap,
  timer,
  catchError,
  of,
  startWith,
  tap,
} from 'rxjs';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
}

@Component({
  selector: 'app-coingecko',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './coingecko.html',
  styleUrls: ['./coingecko.scss'],
})
export class Coingecko implements AfterViewInit {
  private http = inject(HttpClient);
  @ViewChildren('sparkline') sparklines!: QueryList<any>;

  // ---- GESTION DES ONGLETS ----
  activeTab$ = new BehaviorSubject<'overview' | 'buysell'>('overview');

  // ---- STATE REACTIF ----
  selectedCoin$ = new BehaviorSubject<string | null>(null); // Filtre réactif
  refreshInterval$ = new BehaviorSubject<number>(5000); // 5s par défaut

  private readonly apiUrl = 'https://api.coingecko.com/api/v3/coins/markets';

  private readonly defaultParams: Record<string, string> = {
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: '100',
    page: '1',
    sparkline: 'false',
  };

  // ---- FETCH PAGE ----
  private fetchPage = (page: number) =>
    this.http.get<Coin[]>(this.apiUrl, { params: { ...this.defaultParams, page: String(page) } });

  // ---- COINS STREAM avec rafraîchissement périodique ----
  coins$ = this.refreshInterval$.pipe(
    switchMap((interval) =>
      timer(0, interval).pipe(
        switchMap(() =>
          this.fetchPage(1).pipe(
            tap((data) => console.log('Données chargées:', data)),
            catchError((err) => {
              console.error('Erreur lors du chargement des coins:', err);
              return of([] as Coin[]);
            })
          )
        )
      )
    ),
    startWith([] as Coin[]),
    share()
  );

  // ---- SYMBOLS UNIQUE POUR FILTRE ----
  symbolTypes$ = this.coins$.pipe(
    map((coins) => [...new Set(coins.map((coin) => coin.symbol.toUpperCase()))])
  );

  // ---- FILTRE REACTIF ----
  filteredCoins$ = combineLatest([this.coins$, this.selectedCoin$]).pipe(
    map(([coins, selectedCoin]) => {
      if (!selectedCoin || selectedCoin === '') return coins;
      // Filtre sur le symbole pour correspondre au select
      return coins.filter((coin: Coin) => coin.symbol.toLowerCase() === selectedCoin.toLowerCase());
    }),
    startWith([] as Coin[])
  );

  // ---- VARIATIONS 24H ----
  variation$ = this.coins$.pipe(
    map((coins) =>
      coins.map((c) => ({
        id: c.id,
        symbol: c.symbol,
        change: c.price_change_percentage_24h,
      }))
    )
  );

  // ---- TOP 20 CRYPTOS LES PLUS TRADÉES ----
  topTraded$ = this.coins$.pipe(
    map((coins: Coin[]) =>
      [...coins]
        .sort((a, b) => b.total_volume - a.total_volume)
        .slice(0, 20)
    ),
    startWith([] as Coin[])
  );

  // ---- TOP GAINERS ET LOSERS ----
  topGainers$ = this.coins$.pipe(
    map((coins) =>
      [...coins]
        .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
        .slice(0, 5)
    ),
    startWith([] as Coin[])
  );

  topLosers$ = this.coins$.pipe(
    map((coins) =>
      [...coins]
        .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
        .slice(0, 5)
    ),
    startWith([] as Coin[])
  );

  ngAfterViewInit() {
    this.filteredCoins$.subscribe((coins) => {
      // Dessiner les sparklines après que les coins soient filtrés
      setTimeout(() => {
        const canvases = document.querySelectorAll('canvas[sparkline]');
        canvases.forEach((canvas: any, index: number) => {
          if (coins[index]) {
            this.drawSparkline(canvas, coins[index]);
          }
        });
      }, 0);
    });
  }

  private drawSparkline(canvas: HTMLCanvasElement, coin: Coin) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Données simulées pour le graphique (dernières 30 jours)
    const prices = Array(30)
      .fill(null)
      .map(() => coin.current_price * (0.9 + Math.random() * 0.2));

    const width = canvas.width;
    const height = canvas.height;
    const padding = 5;

    // Trouver min/max
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;

    // Couleur basée sur la variation
    const color = coin.price_change_percentage_24h >= 0 ? '#10b981' : '#ef4444';

    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    prices.forEach((price, i) => {
      const x = padding + (i / (prices.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((price - min) / range) * (height - 2 * padding);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
  }
}
