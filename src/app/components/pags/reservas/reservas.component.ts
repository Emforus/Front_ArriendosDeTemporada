import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Departamento } from 'src/app/components/_models/departamento';
import { DeptoService } from 'src/app/components/_services/depto.service';
import { DetalleDepartamentoComponent } from '../departamentos/detalle-departamento/detalle-departamento.component';
import { Factura } from '../../_models/factura';
import { BookingService } from '../../_services/booking.service';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from 'src/app/components/_services/loader.service';
import { Router } from '@angular/router';
import { LoginService } from '../../_services/login.service';
import { Usuario } from '../../_models/usuario';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {

  formatter = new Intl.NumberFormat('CL', {
    style: 'currency',
    currency: 'CLP'
  })

  facturas: Factura[] = new Array();
  //@ts-ignore
  depto: Departamento;
  pending: Factura[] = new Array();
  cancelled: Factura[] = new Array();
  completed: Factura[] = new Array();

  curUser: Usuario = new Usuario();


  constructor(
    private router: Router,
    private deptoService: DeptoService,
    private bookingService: BookingService,
    private dialog: MatDialog,
    private loginService: LoginService,
    public loaderService: LoaderService,
    public cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.loginService.getAuthData().subscribe(data => {
      this.curUser.id = data.id;
      this.curUser.rol = data.rol;
      this.curUser.nombreUsuario = data.username;
    })
    this.bookingService.listarPorCliente(this.curUser.id).subscribe(data => {
      this.facturas = data;
      this.sortItems(data);
    })

    this.bookingService.getChange().subscribe(data => {
      this.facturas = data;
      this.sortItems(data);
      this.cdr.detectChanges();
    })

    this.deptoService.getChange().subscribe(data => {
      this.cdr.detectChanges();
    })
  }

  sortItems(data: any) {
    this.pending = []
    this.cancelled = []
    this.completed = []
    data.forEach((item: Factura) => {
      console.log(item.id)
      switch (item.estado) {
        case "Pendiente":
          this.pending.push(item)
          console.log(item.id+" pendiente")
          break;
        case "Cancelada":
          this.cancelled.push(item)
          console.log(item.id+" cancelada")
          break;
        case "Completada":
          this.completed.push(item)
          console.log(item.id+" completada")
          break;
        default:
          break;
      }
    });
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
    this.depto.utilidades = element.utilidades;
    this.depto.facturas = element.facturas;

    this.dialog.open(DetalleDepartamentoComponent, {
      height: '95%',
      width: '75%',
      autoFocus: false,
      data: this.depto
    })
  }
  
  cancel(element: any) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {mensaje: '¿Está seguro de que desea anular su reserva? El depósito inicial no sera retornado.', accion: 'eliminar'}
    }).afterClosed().subscribe((response: {status: boolean}) => {
      if (response.status) {
        this.bookingService.anularReserva(element).pipe(switchMap( ()=> {
          return this.bookingService.listarPorCliente(this.curUser.id)
        })).subscribe(data => {
          this.bookingService.setChange(data);
        })
      }
    })
  }
}
