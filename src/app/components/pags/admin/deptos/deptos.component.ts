import { Component, OnInit, ViewChild } from '@angular/core';
import { Departamento } from 'src/app/components/_models/departamento';
import { Utilidad } from 'src/app/components/_models/utilidad';
import { DeptoService } from 'src/app/components/_services/depto.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { LoaderService } from 'src/app/components/_services/loader.service';
import { MatTableDataSource } from '@angular/material/table';
import { DeptoDetailComponent } from './depto-detail/depto-detail.component';
import { DeptoEditComponent } from './depto-edit/depto-edit.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deptos',
  templateUrl: './deptos.component.html',
  styleUrls: ['./deptos.component.css']
})
export class DeptosComponent implements OnInit {

  formatter = new Intl.NumberFormat('CL', {
    style: 'currency',
    currency: 'CLP'
  })

  constructor(
    private deptoService: DeptoService,
    private dialog: MatDialog,
    public loaderService: LoaderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('rol')!='Admin') {
      this.router.navigate(['**'])
    }

    this.deptoService.getChange().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort
      this.dataSource.paginator = this.paginator
    })

    this.deptoService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort
      this.dataSource.paginator = this.paginator
    })
  }

  //@ts-ignore
  depto: Departamento;

  displayedColumns = ['nombreDepartamento', 'regionDepartamento', 'ubicacionDepartamento', 'valorBase', 'cantidadDormitorios', 'estado', 'estadoLogico', 'acciones']
  dataSource!: MatTableDataSource<Departamento>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dialogOpen() {
    return (this.dialog.openDialogs.length == 0)
  }

  detail(element: any) {
    this.depto = new Departamento();
    this.depto.idDepartamento = element.idDepartamento;
    this.depto.nombreDepartamento = element.nombreDepartamento;
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
    this.depto.utilidades = element.utilidades;
    this.depto.facturas = element.facturas;
    this.depto.serviciosPrincipales = element.serviciosPrincipales;
    this.depto.serviciosDisponibles = element.serviciosDisponibles;

    console.log(element)

    this.dialog.open(DeptoDetailComponent, {
      height: '95%',
      width: '75%',
      autoFocus: false,
      data: this.depto
    })
  }

  edit(element: any) {
    console.log(element)
    this.depto = new Departamento();
    this.depto.idDepartamento = element.idDepartamento;
    this.depto.nombreDepartamento = element.nombreDepartamento;
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
    this.depto.utilidades = element.utilidades;
    this.depto.facturas = element.facturas;
    this.depto.serviciosPrincipales = element.serviciosPrincipales;
    this.depto.serviciosDisponibles = element.serviciosDisponibles;

    this.dialog.open(DeptoEditComponent, {
      height: '95%',
      width: '75%',
      autoFocus: false,
      data: this.depto
    })
  }

  create() {
    this.depto = new Departamento();

    this.dialog.open(DeptoEditComponent, {
      height: '95%',
      width: '75%',
      autoFocus: false,
      data: this.depto
    })
  }

}
