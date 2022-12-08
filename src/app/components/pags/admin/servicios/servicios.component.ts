import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ServicioExtra } from 'src/app/components/_models/servicio.extra';
import { LoaderService } from 'src/app/components/_services/loader.service';
import { ServicioService } from 'src/app/components/_services/servicio.service';
import { ServicioDetailComponent } from './servicio-detail/servicio-detail.component';
import { ServicioEditComponent } from './servicio-edit/servicio-edit.component';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})
export class ServiciosComponent implements OnInit {

  displayedColumns = [ 'id', 'nombre', 'descripcion', 'costoServicio', 'tipoFacturacion', 'estadoLogico', 'acciones']
  dataSource!: MatTableDataSource<ServicioExtra>;

  //@ts-ignore
  svc: ServicioExtra

  formatter = new Intl.NumberFormat('CL', {
    style: 'currency',
    currency: 'CLP'
  })

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    public loaderService: LoaderService,
    private router: Router,
    private servicioService: ServicioService,
    private cdr: ChangeDetectorRef
    ) { }



  ngOnInit(): void {
    this.loadServicios()

    this.servicioService.getChange().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort
      this.dataSource.paginator = this.paginator
    })

  }
  loadServicios() {
    this.servicioService.listar().subscribe(data => {
      data.forEach(element => {
        console.log(element.estadoLogico)
      });
      this.dataSource = new MatTableDataSource(data)
      this.dataSource.sort = this.sort
      this.dataSource.paginator = this.paginator
    })
  }

  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }

  dialogOpen() {
    return (this.dialog.openDialogs.length == 0)
  }

  formatDate(date: Date) {
    date = new Date(date);
    return [
      this.padTo2Digits(date.getDate()),
      this.padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join('/');
  }

  detail(element: any) {
    this.svc = new ServicioExtra();
    this.svc.id = element.id;
    this.svc.nombre = element.nombre;
    this.svc.descripcion = element.descripcion;
    this.svc.costoServicio = element.costoServicio;
    this.svc.fechaContrato = element.fechaContrato;
    this.svc.fechaUltimaRenovacion = element.fechaUltimaRenovacion;
    this.svc.fechaExpiracion = element.fechaExpiracion;
    this.svc.estadoLogico = element.estadoLogico;
    this.svc.servicioUnitario = element.servicioUnitario;

    console.log(element)

    this.dialog.open(ServicioDetailComponent, {
      height: '95%',
      width: '75%',
      autoFocus: false,
      data: this.svc
    })
  }

  edit(element: any) {
    
    console.log(element)
    this.svc = new ServicioExtra();
    this.svc.id = element.id;
    this.svc.nombre = element.nombre;
    this.svc.descripcion = element.descripcion;
    this.svc.costoServicio = element.costoServicio;
    this.svc.fechaContrato = element.fechaContrato;
    this.svc.fechaUltimaRenovacion = element.fechaUltimaRenovacion;
    this.svc.fechaExpiracion = element.fechaExpiracion;
    this.svc.estadoLogico = element.estadoLogico;
    this.svc.servicioUnitario = element.servicioUnitario;

    this.dialog.open(ServicioEditComponent, {
      height: '95%',
      width: '75%',
      autoFocus: false,
      data: this.svc
    })
  }

  create() {
    this.svc = new ServicioExtra();

    this.dialog.open(ServicioEditComponent, {
      height: '95%',
      width: '75%',
      autoFocus: false,
      data: this.svc
    })
  }

}
