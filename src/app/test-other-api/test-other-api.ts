import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { flattenDeep, uniq } from 'lodash';
import { BehaviorSubject, combineLatest, delay, EMPTY, expand, map, scan, share } from 'rxjs';

interface Result<T> {
  count: number;
  next: string;
  previous: string | null;
  results: T[];
}

interface Planet {
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
  population: string;
  residents: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
}

@Component({
  selector: 'app-list',
  imports: [CommonModule],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class List {
  private http = inject(HttpClient);

  selectedFilter = new BehaviorSubject<string | null>(null);

  planets$ = this.http.get<Result<Planet>>('https://swapi.dev/api/planets').pipe(
    expand((res) => (res.next ? this.http.get<Result<Planet>>(res.next).pipe(delay(5000)) : EMPTY)),
    map((res) => res.results),
    scan((acc, curr) => acc.concat(curr), [] as Planet[]),
    share()
  );

  terrainTypes$ = this.planets$.pipe(
    map((planets) => {
      const terrains = planets.map((planet) => {
        let terrainsOfThePlanet = planet.terrain.split(', ');
        return terrainsOfThePlanet;
      });

      const uniqueTerrains = uniq(flattenDeep(terrains));
      return uniqueTerrains;
    })
  );

  filteredPlanets$ = combineLatest([this.planets$, this.selectedFilter]).pipe(
    map(([planets, selectedFilter]) => {
      if (!selectedFilter) {
        return planets;
      }
      return planets.filter((planet) => planet.terrain.includes(selectedFilter));
    })
  );
}
