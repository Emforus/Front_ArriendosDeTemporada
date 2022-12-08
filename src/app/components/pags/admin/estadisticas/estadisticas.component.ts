import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
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
import { EstadisticasDetalleMesComponent } from './estadisticas-detalle-mes/estadisticas-detalle-mes.component';
import { ServicioFactura } from 'src/app/components/_models/join.servicio.factura';
import * as CanvasJS from 'src/canvasjs.angular.component'

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {

  displayedColumnsHistorica = [ 'fecha', 'arriendos', 'ganancias', 'servicios', 'acciones']
  displayedColumns = [ 'id', 'valor', 'valorServicios', 'arriendos', 'cancelaciones']
  dataSource!: MatTableDataSource<any>;
  dataHistorica!: MatTableDataSource<any>;
  infoHistorico: any[] = new Array()
  infoMes: {} = {}
  infoMesPorDepto: any[] = new Array()
  numArriendos: number = 0

  chartOptions = {
    title: {
      text: "Basic Column Chart in Angular"
    },
    data: [{
      type: "column",
      dataPoints: [
        { label: "Apple",  y: 10  },
        { label: "Orange", y: 15  },
        { label: "Banana", y: 25  },
        { label: "Mango",  y: 30  },
        { label: "Grape",  y: 28  }
      ]
    }]	  
  };

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

  
  formatter = new Intl.NumberFormat('CL', {
    style: 'currency',
    currency: 'CLP'
  })
  
  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild(MatSort) sort1!: MatSort;
  @ViewChild('paginator2') paginator2!: MatPaginator;
  @ViewChild(MatSort) sort2!: MatSort;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    public loaderService: LoaderService,
    private router: Router,
    private bookingService: BookingService,
    private cdr: ChangeDetectorRef)
    {}

  ngOnInit(): void {
    this.loadHistorico()
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
        if (_now.getMonth() == fecha.getMonth()) {
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

  loadHistorico() {
    this.bookingService.listar().subscribe(data => {
      for (let mes =1; mes<=12;mes++) {
        let info = {
          fecha: this.meses[mes],
          fechaNum: mes-1,
          arriendos: 0,
          cancelaciones: 0,
          ganancias: 0,
          ingresoCanceladas: 0,
          ingresoServicios: 0,
          ingresoCompletadas: 0,
          servicios:""
        }
        for (let item of data) {
          this._ajustarValor(item)
          let fecha = new Date(item.fechaHoraReserva)
          if (mes == fecha.getMonth()+1) {
            info.arriendos ++
            if (item.estado == "Cancelada") {
              info.ingresoCanceladas += Math.round(item.valor*0.2)
            } else {
              info.ganancias += item.valor
              info.ingresoCompletadas += item.valor
            }
            /* info.servicios  */
          }
        }
        this.infoHistorico.push(info)
      }
      this.dataHistorica = new MatTableDataSource(this.infoHistorico)
      this.dataHistorica.sort = this.sort2
      this.dataHistorica.paginator = this.paginator2
      this.cdr.detectChanges();
    })
  }

  dialogOpen() {
    return (this.dialog.openDialogs.length == 0)
  }

  detalleMes(mes: any) {
    this.dialog.open(EstadisticasDetalleMesComponent, {
      height: '95%',
      width: '60%',
      autoFocus: false,
      data: mes
    })
  }

  //funcion temporal, ajusta valor por el cambio en la db
  _ajustarValor(fac: Factura) {
    if (fac.valor == 0) {
      fac.valor = (fac.departamento.valorBase*fac.duracion)+fac.valorIVA
    }
  }
}