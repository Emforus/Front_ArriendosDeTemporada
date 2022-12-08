import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticasDetalleMesComponent } from './estadisticas-detalle-mes.component';

describe('EstadisticasDetalleMesComponent', () => {
  let component: EstadisticasDetalleMesComponent;
  let fixture: ComponentFixture<EstadisticasDetalleMesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstadisticasDetalleMesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadisticasDetalleMesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
