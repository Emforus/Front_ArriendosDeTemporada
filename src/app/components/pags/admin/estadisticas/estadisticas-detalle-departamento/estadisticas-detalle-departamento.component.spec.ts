import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticasDetalleDepartamentoComponent } from './estadisticas-detalle-departamento.component';

describe('EstadisticasDetalleDepartamentoComponent', () => {
  let component: EstadisticasDetalleDepartamentoComponent;
  let fixture: ComponentFixture<EstadisticasDetalleDepartamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstadisticasDetalleDepartamentoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadisticasDetalleDepartamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
