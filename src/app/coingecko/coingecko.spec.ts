import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Coingecko } from './coingecko';

describe('Coingecko', () => {
  let component: Coingecko;
  let fixture: ComponentFixture<Coingecko>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Coingecko]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Coingecko);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
