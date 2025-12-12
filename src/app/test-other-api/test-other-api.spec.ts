import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestOtherApi } from './test-other-api';

describe('TestOtherApi', () => {
  let component: TestOtherApi;
  let fixture: ComponentFixture<TestOtherApi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestOtherApi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestOtherApi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
