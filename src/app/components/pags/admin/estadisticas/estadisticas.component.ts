import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Usuario } from '../../../_models/usuario';
import { UserService } from 'src/app/components/_services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { LoaderService } from 'src/app/components/_services/loader.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BookingService } from 'src/app/components/_services/booking.service';
import { Factura } from 'src/app/components/_models/factura';


@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {

  displayedColumnsHistorica = [ 'fecha', 'arriendos', 'ganancias', 'servicios']
  displayedColumns = [ 'arriendos', 'ganancias', 'servicios']
  dataSource!: MatTableDataSource<Usuario>;
  dataHistorica!: MatTableDataSource<Usuario>;
  infoHistorico: any[] = new Array()
  numArriendos: number = 0

  meses:{[mes:number]: string} = {
    1:'Enero',
    2:'Febrero',
    3:'Marzo',
    4:'Abril',
    5:'Mayo',
    6:'Junio',
    7:'Julio',
    8:'Agosto',
    9:'Septiembre',
    10:'Octubre',
    11:'Noviembre',
    12:'Diciembre',
  }

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    public loaderService: LoaderService,
    private router: Router,
    private bookingService: BookingService,
    private cdr: ChangeDetectorRef)
    {}

  ngOnInit(): void {
    /* let wea = {
      fecha:"noviembre",
      arriendos: "3",
      ganancias: "45.000",
      servicios: "tour"
    }
    this.infoHistorico.push(wea)
    this.dataHistorica = new MatTableDataSource(this.infoHistorico) */
    
    this.bookingService.listar().subscribe(data => {
      for (let mes =1; mes<=12;mes++) {
        let info = {
          fecha:"",
          arriendos: 0,
          ganancias: 0,
          servicios:""
        }
        for (let item of data) {
          if (mes == item.fechaHoraGeneracion.getMonth()) {
            info.fecha = this.meses[mes]
            info.arriendos ++
            info.ganancias += item.valorTotal
            /* info.servicios  */
          }
        }
        this.infoHistorico.push(info)
      }
      this.dataHistorica = new MatTableDataSource(this.infoHistorico)
      this.cdr.detectChanges();
    })

  /* this.bookingService.getChange().subscribe(data => {
    this.facturas = data;
    this.sortItems(data);
    this.cdr.detectChanges();
  }) */
  }
  dialogOpen() {
    return (this.dialog.openDialogs.length == 0)
  }
}