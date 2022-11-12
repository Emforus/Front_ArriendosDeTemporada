import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeptosComponent } from './deptos.component';

describe('DeptosComponent', () => {
  let component: DeptosComponent;
  let fixture: ComponentFixture<DeptosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeptosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeptosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
