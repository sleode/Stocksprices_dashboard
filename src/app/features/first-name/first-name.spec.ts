import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstName } from './first-name';

describe('FirstName', () => {
  let component: FirstName;
  let fixture: ComponentFixture<FirstName>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstName]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstName);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
