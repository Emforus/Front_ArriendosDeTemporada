import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Factura } from '../../_models/factura';
import { Usuario } from '../../_models/usuario';
import { BookingService } from '../../_services/booking.service';
import { LoaderService } from '../../_services/loader.service';
import { UserService } from '../../_services/user.service';
import { CheckinComponent } from './checkin/checkin.component';
import { CheckoutComponent } from './checkout/checkout.component';

@Component({
  selector: 'app-recepcion',
  templateUrl: './recepcion.component.html',
  styleUrls: ['./recepcion.component.css']
})
export class RecepcionComponent implements OnInit {
  
  displayedColumns = [ 'id', 'nombreCliente', 'departamento', 'fecha', 'valor', 'estado', 'acciones']
  dataSource!: MatTableDataSource<Factura>;
  criterio: string = ""
  filtro: string = ""
  showAll: boolean = false
  criterios = [
    {value: 'Cliente'},
    {value: 'Departamento'},
    {value: 'Estado'}
  ]

  formatter = new Intl.NumberFormat('CL', {
    style: 'currency',
    currency: 'CLP'
  })

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  //@ts-ignore
  factura: Factura

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    public loaderService: LoaderService,
    private router: Router,
    private bookingService: BookingService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadFacturas()
    this.bookingService.getChange().subscribe(data => {
      this.cdr.detectChanges();
      this.loadFacturas();
    })
  }
  
  loadFacturas() {
    this.bookingService.listar().subscribe(data => {
      if (!this.showAll) {
        data = data.filter(item => {
          return (item.estado!="Cancelada"&&item.estado!="Completada")
        })
      }
      data.forEach(item => {
        this._ajustarValor(item)
      });
      this.dataSource = new MatTableDataSource(data)
      this.dataSource.sort = this.sort
      this.dataSource.paginator = this.paginator
    })
  }

  dialogOpen() {
    return (this.dialog.openDialogs.length == 0)
  }

  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }

  formatDate(date: Date) {
    date = new Date(date);
    return [
      this.padTo2Digits(date.getDate()),
      this.padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join('/');
  }

  ajustarFiltro() {
    this.dataSource.filterPredicate = (d: Factura, filter: string) => {
      let textToSearch = ''
      switch (this.criterio) {
        case 'Cliente':
          textToSearch = d.usuario.nombreUsuario && d.usuario.nombreUsuario.toLowerCase() || '';
          break;
        case 'Departamento':
          textToSearch = d.departamento.ubicacionDepartamento && d.departamento.ubicacionDepartamento.toLowerCase() || '';
          break;
        case 'Estado':
          textToSearch = d.estado && d.estado.toLowerCase() || '';
          break;
        default:
          textToSearch = ''
          break;
      }
      return textToSearch.indexOf(filter) !== -1;
    }
  }
  filtrar() {
    console.log("filtrando...")
    this.dataSource.filter = this.filtro.trim().toLowerCase()
  }

  //funcion temporal, ajusta valor por el cambio en la db
  _ajustarValor(fac: Factura) {
    // if (fac.valor == 0) {
    //   fac.valor = Math.round(fac.departamento.valorBase*fac.duracion)+fac.valorIVA
    // }
    // if (fac.valorDeposito == 0) {
    //   fac.valorDeposito = Math.round(fac.valor*20/100)
    // }
  }

  checkIn(element: any) {
    this.factura = new Factura();
    this.factura.id = element.id
    this.factura.cantidadClientes = element.cantidadClientes
    this.factura.departamento = element.departamento
    this.factura.duracion = element.duracion
    this.factura.estado = element.estado
    this.factura.fechaHoraCheckIn = element.fechaHoraCheckIn
    this.factura.fechaHoraCheckOut = element.fechaHoraCheckOut
    this.factura.fechaHoraGeneracion = element.fechaHoraGeneracion
    this.factura.fechaHoraReserva = element.fechaHoraReserva
    this.factura.usuario = element.usuario
    this.factura.valor = element.valor
    this.factura.valorDeposito = element.valorDeposito
    this.factura.valorIVA = element.valorIVA
    this.factura.valorServicios = element.valorServicios

    console.log(element)

    this.dialog.open(CheckinComponent, {
      height: '95%',
      width: '75%',
      autoFocus: false,
      data: this.factura
    })
  }

  checkOut(element: any) {
    this.factura = new Factura();
    this.factura.id = element.id
    this.factura.cantidadClientes = element.cantidadClientes
    this.factura.departamento = element.departamento
    this.factura.duracion = element.duracion
    this.factura.estado = element.estado
    this.factura.fechaHoraCheckIn = element.fechaHoraCheckIn
    this.factura.fechaHoraCheckOut = element.fechaHoraCheckOut
    this.factura.fechaHoraGeneracion = element.fechaHoraGeneracion
    this.factura.fechaHoraReserva = element.fechaHoraReserva
    this.factura.usuario = element.usuario
    this.factura.valor = element.valor
    this.factura.valorDeposito = element.valorDeposito
    this.factura.valorIVA = element.valorIVA
    this.factura.valorServicios = element.valorServicios

    console.log(element)

    this.dialog.open(CheckoutComponent, {
      height: '95%',
      width: '75%',
      autoFocus: false,
      data: this.factura
    })
  }
}
