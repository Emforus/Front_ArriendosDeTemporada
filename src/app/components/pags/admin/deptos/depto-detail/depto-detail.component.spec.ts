import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeptoDetailComponent } from './depto-detail.component';

describe('DeptoDetailComponent', () => {
  let component: DeptoDetailComponent;
  let fixture: ComponentFixture<DeptoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeptoDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeptoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
