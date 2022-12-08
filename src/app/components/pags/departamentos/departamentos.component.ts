import { Component, OnInit, ViewChild } from '@angular/core';
import { Departamento } from 'src/app/components/_models/departamento';
import { DeptoService } from 'src/app/components/_services/depto.service';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from 'src/app/components/_services/loader.service';
import { Router } from '@angular/router';
import { ArriendoComponent } from './arriendo/arriendo.component';
import { DetalleDepartamentoComponent } from './detalle-departamento/detalle-departamento.component';

@Component({
  selector: 'app-departamentos',
  templateUrl: './departamentos.component.html',
  styleUrls: ['./departamentos.component.css']
})
export class DepartamentosComponent implements OnInit {

  formatter = new Intl.NumberFormat('CL', {
    style: 'currency',
    currency: 'CLP'
  })
  //@ts-ignore
  departamentos: any;
  //@ts-ignore
  depto: Departamento;

  constructor(
    private router: Router,
    private deptoService: DeptoService,
    private dialog: MatDialog,
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {

    this.deptoService.getChange().subscribe(data => {
      this.departamentos = data;
    })

    this.deptoService.listar().subscribe(data => {
      this.departamentos = data;
    })
  }

  dialogOpen() {
    return (this.dialog.openDialogs.length == 0)
  }

  detail(element: any) {
    this.depto = new Departamento();
    this.depto.idDepartamento = element.idDepartamento;
    this.depto.descripcionDepartamento = element.descripcionDepartamento;
    this.depto.ubicacionDepartamento = element.ubicacionDepartamento;
    this.depto.regionDepartamento = element.regionDepartamento;
    this.depto.cantidadDormitorios = element.cantidadDormitorios;
    this.depto.estado = element.estado;
    this.depto.valorBase = element.valorBase;
    this.depto.fechaRegistroDepartamento = element.fechaRegistroDepartamento;
    this.depto.fechaUltimaReserva = element.fechaUltimaReserva;
    this.depto.fechaUltimaMantencion = element.fechaUltimaMantencion;
    this.depto.estadoLogico = element.estadoLogico;
    this.depto.fotografias = element.fotografias;
    this.depto.serviciosPrincipales = element.serviciosPrincipales;
    this.depto.utilidades = element.utilidades;
    this.depto.facturas = element.facturas;
    this.depto.serviciosDisponibles = element.serviciosDisponibles;

    this.dialog.open(DetalleDepartamentoComponent, {
      height: '95%',
      width: '75%',
      autoFocus: false,
      data: this.depto
    })
  }
  
  reserve(element: any) {
    this.depto = new Departamento();
    this.depto.idDepartamento = element.idDepartamento;
    this.depto.descripcionDepartamento = element.descripcionDepartamento;
    this.depto.ubicacionDepartamento = element.ubicacionDepartamento;
    this.depto.regionDepartamento = element.regionDepartamento;
    this.depto.cantidadDormitorios = element.cantidadDormitorios;
    this.depto.estado = element.estado;
    this.depto.valorBase = element.valorBase;
    this.depto.fechaRegistroDepartamento = element.fechaRegistroDepartamento;
    this.depto.fechaUltimaReserva = element.fechaUltimaReserva;
    this.depto.fechaUltimaMantencion = element.fechaUltimaMantencion;
    this.depto.estadoLogico = element.estadoLogico;
    this.depto.fotografias = element.fotografias;
    this.depto.serviciosPrincipales = element.servicios;
    this.depto.utilidades = element.utilidades;
    this.depto.facturas = element.facturas;
    this.depto.serviciosDisponibles = element.serviciosDisponibles;

    this.dialog.open(ArriendoComponent, {
      height: '95%',
      width: '75%',
      autoFocus: false,
      data: this.depto
    })
  }

}
