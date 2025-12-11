import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BakeryContainer } from './bakery-container';

describe('BakeryContainer', () => {
  let component: BakeryContainer;
  let fixture: ComponentFixture<BakeryContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BakeryContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BakeryContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
