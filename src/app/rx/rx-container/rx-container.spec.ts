import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RxContainer } from './rx-container';

describe('RxContainer', () => {
  let component: RxContainer;
  let fixture: ComponentFixture<RxContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RxContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RxContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
