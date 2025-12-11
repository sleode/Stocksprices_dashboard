import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, combineLatest, delay, EMPTY, expand, map, scan, share } from 'rxjs';

interface Result<T> {
  data: T[];
  next?: string;
  pagination?: {
    current_page: number;
    per_page: number;
    total: number;
  };
}

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
export class Coingecko {
  private htt = inject(HttpClient);
  selectedCoin = new BehaviorSubject<string | null>(null);
  private readonly apiUrl = 'https://api.coingecko.com/api/v3/coins/markets';

  private readonly defaultParams: Record<string, string> = {
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: '10',
    page: '1',
    sparkline: 'false',
  };

  private fetchPage = (page: number) =>
    this.htt.get<Coin[]>(this.apiUrl, { params: { ...this.defaultParams, page: String(page) } });

  coins$ = this.fetchPage(1).pipe(
    map((coins) => ({ page: 1, coins } as { page: number; coins: Coin[] })),
    expand((res) =>
      res.coins.length === Number(this.defaultParams['per_page'])
        ? this.fetchPage(res.page + 1).pipe(map((c) => ({ page: res.page + 1, coins: c })))
        : EMPTY
    ),
    map((res) => res.coins),
    scan((acc, curr) => acc.concat(curr), [] as Coin[]),
    share()
  );

  symbolTypes$ = this.coins$.pipe(
    map((coins) => {
      const symbols = coins.map((coin) => coin.symbol.toUpperCase());
      return [...new Set(symbols)]; // Unique symbols
    })
  );

  filteredCoins$ = combineLatest([this.coins$, this.selectedCoin]).pipe(
    map(([coins, selectedCoin]) => {
      if (!selectedCoin) {
        return coins;
      }
      return coins.filter((coin) => coin.id === selectedCoin);
    })
  );
}
