import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Factura } from 'src/app/components/_models/factura';
import { ServicioFactura } from 'src/app/components/_models/join.servicio.factura';
import { BookingService } from 'src/app/components/_services/booking.service';
import { LoaderService } from 'src/app/components/_services/loader.service';
import { UserService } from 'src/app/components/_services/user.service';

@Component({
  selector: 'app-estadisticas-detalle-mes',
  templateUrl: './estadisticas-detalle-mes.component.html',
  styleUrls: ['./estadisticas-detalle-mes.component.css']
})
export class EstadisticasDetalleMesComponent implements OnInit {

  
  formatter = new Intl.NumberFormat('CL', {
    style: 'currency',
    currency: 'CLP'
  })
  displayedColumns = [ 'id', 'valor', 'valorServicios', 'arriendos', 'cancelaciones']
  dataSource!: MatTableDataSource<any>;
  infoMes: {} = {}
  infoMesPorDepto: any[] = new Array()
  numArriendos: number = 0
  ingresosDeptoMes = {
    title: {
      text: "Ingresos del mes por departamento"
    },
    data: [{
      type: "column",
      dataPoints: [] = new Array<any>()
    }]	  
  };

  estadoReservasMes = {
    title: {
      text: "Estado actual de reservas del mes"
    },
    data: [{
      type: "pie",
      dataPoints: [] = new Array<any>()
    }]	  
  };

  _mes:any

  constructor(
    private userService: UserService,
    private dialogRef: MatDialogRef<EstadisticasDetalleMesComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialog: MatDialog,
    public loaderService: LoaderService,
    private router: Router,
    private bookingService: BookingService,
    private cdr: ChangeDetectorRef
    ) { }

  ngOnInit(): void {
    this._mes = this.data
    this.loadMes()
    this.cdr.detectChanges();
  }

  loadMes() {
    this.bookingService.listar().subscribe(data => {
      let info = {
        //Consolidado
        arriendos: 0,
        completados: 0,
        cancelados: 0,
        ingresoCanceladas: 0,
        ingresoServicios: 0,
        ingresoCompletadas: 0,
        ingresoPendientes: 0
        // arriendosPorDepto: new Map<number, number>(),
        // cancelacionesPorDepto: new Map<number, number>()
      }
      let deptos: {[key:number]:{
        id: number,
        valor: number,
        valorServicios:number,
        arriendos:number,
        cancelaciones:number,
        servicioPopular: {[key:number]:number}
      }} = {}
      for (let item of data) {
        item.serviciosPorFactura ??= new Array<ServicioFactura>()
        this._ajustarValor(item)
        let _now = new Date()
        let fecha = new Date(item.fechaHoraReserva)
        if (this._mes == fecha.getMonth()-1) {
          info.arriendos ++
          if (deptos[item.departamento.idDepartamento]===undefined) {
            deptos[item.departamento.idDepartamento] = {            
              id: item.departamento.idDepartamento,
              valor: item.valor,
              valorServicios: item.valorServicios,
              arriendos: 0,
              cancelaciones:0,
              servicioPopular: {}
            }
            deptos[item.departamento.idDepartamento].id = item.departamento.idDepartamento
            deptos[item.departamento.idDepartamento].valor = item.valor
            deptos[item.departamento.idDepartamento].valorServicios = item.valorServicios
            deptos[item.departamento.idDepartamento].arriendos = 1
            if (item.estado == "Cancelada") {
              deptos[item.departamento.idDepartamento].cancelaciones = 1
            } else {
              deptos[item.departamento.idDepartamento].cancelaciones = 0
            }
            item.serviciosPorFactura.forEach(function(e) {
              if (deptos[item.departamento.idDepartamento].servicioPopular[e.idServicio]===undefined) {
                deptos[item.departamento.idDepartamento].servicioPopular[e.idServicio] = 0
              }
              deptos[item.departamento.idDepartamento].servicioPopular[e.idServicio] += 1
            })
          } else {
            deptos[item.departamento.idDepartamento].valor += item.valor
            deptos[item.departamento.idDepartamento].valorServicios += item.valorServicios
            deptos[item.departamento.idDepartamento].arriendos += 1
            if (item.estado == "Cancelada") {
              deptos[item.departamento.idDepartamento].cancelaciones += 1
            }
            item.serviciosPorFactura.forEach(function(e) {
              if (deptos[item.departamento.idDepartamento].servicioPopular[e.idServicio]===undefined) {
                deptos[item.departamento.idDepartamento].servicioPopular[e.idServicio] = 0
              }
              deptos[item.departamento.idDepartamento].servicioPopular[e.idServicio] += 1
            })
          }
          if (item.estado == "Cancelada") {
            info.cancelados++
            info.ingresoCanceladas += Math.round(item.valor*0.2)
            // info.cancelacionesPorDepto.set(dinfo.idDepartamento, info.cancelacionesPorDepto.get(dinfo.idDepartamento)??0+1)
          } else if (item.estado == "Completada") {
            info.completados++
            info.ingresoCompletadas += item.valor
            info.ingresoServicios += item.valorServicios
            // info.arriendosPorDepto.set(dinfo.idDepartamento, info.arriendosPorDepto.get(dinfo.idDepartamento)??0+1)
          } else {
            info.ingresoPendientes += item.valor
            // info.arriendosPorDepto.set(dinfo.idDepartamento, info.arriendosPorDepto.get(dinfo.idDepartamento)??0+1)
          }
          item.serviciosPorFactura.forEach(x => {
            info.ingresoServicios += x.valorServicio
          })
        }
      }
      this.infoMes = info
      for (let id in deptos) {
        let value = deptos[id]
        this.ingresosDeptoMes.data[0].dataPoints.push({ label: id,  y: value.valor  })
        this.infoMesPorDepto.push(value)
      }
      this.ingresosDeptoMes = {
        title: {
          text: "Ingresos del mes por departamento"
        },
        data: [{
          type: "column",
          dataPoints: this.ingresosDeptoMes.data[0].dataPoints
        }]	  
      };
      this.estadoReservasMes.data[0].dataPoints.push({label: 'Reservas completadas', y: info.completados })
      this.estadoReservasMes.data[0].dataPoints.push({label: 'Reservas canceladas', y: info.cancelados })
      this.estadoReservasMes.data[0].dataPoints.push({label: 'Reservas pendientes', y: info.arriendos-info.completados-info.cancelados })
      this.estadoReservasMes = {
        title: {
          text: "Estado actual de reservas del mes"
        },
        data: [{
          type: "pie",
          dataPoints: this.estadoReservasMes.data[0].dataPoints
        }]	  
      };
      this.dataSource = new MatTableDataSource(this.infoMesPorDepto)
      this.cdr.detectChanges();
    })
  }

  dialogOpen() {
    return (this.dialog.openDialogs.length == 0)
  }

  //funcion temporal, ajusta valor por el cambio en la db
  _ajustarValor(fac: Factura) {
    if (fac.valor == 0) {
      fac.valor = (fac.departamento.valorBase*fac.duracion)+fac.valorIVA
    }
  }

}
