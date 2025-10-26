import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreMain } from './store-main';

describe('StoreMain', () => {
  let component: StoreMain;
  let fixture: ComponentFixture<StoreMain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreMain]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreMain);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
