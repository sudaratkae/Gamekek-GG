import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountManagement } from './discount-management';

describe('DiscountManagement', () => {
  let component: DiscountManagement;
  let fixture: ComponentFixture<DiscountManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscountManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscountManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
