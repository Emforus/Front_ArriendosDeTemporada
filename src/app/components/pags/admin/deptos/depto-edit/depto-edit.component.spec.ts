import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeptoEditComponent } from './depto-edit.component';

describe('DeptoEditComponent', () => {
  let component: DeptoEditComponent;
  let fixture: ComponentFixture<DeptoEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeptoEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeptoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
