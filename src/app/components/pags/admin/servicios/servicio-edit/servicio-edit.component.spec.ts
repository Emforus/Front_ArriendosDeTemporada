import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicioEditComponent } from './servicio-edit.component';

describe('ServicioEditComponent', () => {
  let component: ServicioEditComponent;
  let fixture: ComponentFixture<ServicioEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicioEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicioEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
