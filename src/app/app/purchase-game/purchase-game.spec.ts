import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseGame } from './purchase-game';

describe('PurchaseGame', () => {
  let component: PurchaseGame;
  let fixture: ComponentFixture<PurchaseGame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseGame]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseGame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
