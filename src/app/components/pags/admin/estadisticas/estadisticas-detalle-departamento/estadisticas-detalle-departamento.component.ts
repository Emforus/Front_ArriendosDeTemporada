import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ServicioFactura } from 'src/app/components/_models/join.servicio.factura';
import { ServicioExtra } from 'src/app/components/_models/servicio.extra';
import { BookingService } from 'src/app/components/_services/booking.service';
import { LoaderService } from 'src/app/components/_services/loader.service';
import { UserService } from 'src/app/components/_services/user.service';

@Component({
  selector: 'app-estadisticas-detalle-departamento',
  templateUrl: './estadisticas-detalle-departamento.component.html',
  styleUrls: ['./estadisticas-detalle-departamento.component.css']
})
export class EstadisticasDetalleDepartamentoComponent implements OnInit {

  displayedColumnsHistorica = [ 'fecha', 'arriendos', 'ganancias', 'servicios']
  dataSource!: MatTableDataSource<any>;
  infoHistorico: any[] = new Array()
  infoMes: {} = {}
  numArriendos: number = 0
  now: Date = new Date()
  _depto: number = -1

  ingresosDeptoMes = {
    width: 600,
    dataPointWidth: 20,
    axisX:{
      title: "Mes",
      interval: 1,
      labelAngle: -45
    },
    title: {
      text: "Ingresos por mes"
    },
    data: [{
      type: "column",
      dataPoints: [] = new Array<any>()
    }]	  
  };

  ingresosServicios = {
    title: {
      text: "Ingresos por servicios extra"
    },
    data: [{
      type: "doughnut",
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

  constructor(
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialog: MatDialog,
    public loaderService: LoaderService,
    private router: Router,
    private bookingService: BookingService,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    this._depto = this.data
    this.loadHistorico()
  }

  loadHistorico() {
    this.bookingService.listarPorDepartamento(this._depto).subscribe(data => {
      let deptos: {[key:number]:{
        id: number,
        nombre: string, 
        valor: number,
        valorServicios:number,
        arriendos:number,
        cancelaciones:number,
        servicioPopular: {[key:number]:number},
        servicioMasPopular: ServicioExtra
      }} = {}
      let servicios: {[key:number]:{
        id: number,
        nombre: string, 
        valor: number
      }} = {}
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

          item.serviciosPorFactura ??= new Array<ServicioFactura>()
          let fecha = new Date(item.fechaHoraReserva)

          if (mes == fecha.getMonth()+1) {
            if (item.estado == "Cancelada") {
              info.cancelaciones++
              info.ingresoCanceladas += Math.round(item.valor*0.2)
              // info.cancelacionesPorDepto.set(dinfo.idDepartamento, info.cancelacionesPorDepto.get(dinfo.idDepartamento)??0+1)
            } else if (item.estado == "Completada") {
              info.arriendos++
              info.ingresoCompletadas += item.valor
              info.ingresoServicios += item.valorServicios
              info.ganancias = item.valor+item.valorServicios
            }
            item.serviciosPorFactura.forEach(x => {
              info.ingresoServicios += x.valorServicio
              if (servicios[x.idServicio]===undefined) {
                servicios[x.idServicio] = {
                  id: x.idServicio,
                  nombre: x.servicio.nombre,
                  valor: x.valorServicio
                }
              } else {
                servicios[x.idServicio].valor += x.valorServicio
              }

            })
            
            if (deptos[item.departamento.idDepartamento]===undefined) {
              deptos[item.departamento.idDepartamento] = {            
                id: item.departamento.idDepartamento,
                nombre: item.departamento.nombreDepartamento,
                valor: item.valor,
                valorServicios: item.valorServicios,
                arriendos: 0,
                cancelaciones:0,
                servicioPopular: {},
                servicioMasPopular: new ServicioExtra()
              }
              deptos[item.departamento.idDepartamento].id = item.departamento.idDepartamento
              deptos[item.departamento.idDepartamento].nombre = item.departamento.nombreDepartamento
              deptos[item.departamento.idDepartamento].valor = item.valor
              deptos[item.departamento.idDepartamento].valorServicios = item.valorServicios
              deptos[item.departamento.idDepartamento].arriendos = (item.estado == "Completada")?1:0
              deptos[item.departamento.idDepartamento].cancelaciones = (item.estado == "Cancelada")?1:0
  
              let _maxValue = -1
              let _maxSvc = new ServicioExtra()
              item.serviciosPorFactura.forEach(function(e) {
                if (deptos[item.departamento.idDepartamento].servicioPopular[e.idServicio]===undefined) {
                  deptos[item.departamento.idDepartamento].servicioPopular[e.idServicio] = 0
                }
                deptos[item.departamento.idDepartamento].servicioPopular[e.idServicio] += 1
                if (deptos[item.departamento.idDepartamento].servicioPopular[e.idServicio] > _maxValue) {
                  _maxValue = deptos[item.departamento.idDepartamento].servicioPopular[e.idServicio]
                  _maxSvc = e.servicio
                }
              })
              deptos[item.departamento.idDepartamento].servicioMasPopular = _maxSvc
              console.log(_maxSvc)
              info.servicios = _maxSvc.nombre
            } else {
              deptos[item.departamento.idDepartamento].valor += item.valor
              deptos[item.departamento.idDepartamento].valorServicios += item.valorServicios
              if (item.estado == "Completada") {
                deptos[item.departamento.idDepartamento].arriendos += 1
              }
              if (item.estado == "Cancelada") {
                deptos[item.departamento.idDepartamento].cancelaciones += 1
              }
              let _maxValue = -1
              let _maxSvc = new ServicioExtra()
              item.serviciosPorFactura.forEach(function(e) {
                if (deptos[item.departamento.idDepartamento].servicioPopular[e.idServicio]===undefined) {
                  deptos[item.departamento.idDepartamento].servicioPopular[e.idServicio] = 0
                }
                deptos[item.departamento.idDepartamento].servicioPopular[e.idServicio] += 1
                if (deptos[item.departamento.idDepartamento].servicioPopular[e.idServicio] > _maxValue) {
                  _maxValue = deptos[item.departamento.idDepartamento].servicioPopular[e.idServicio]
                  _maxSvc = e.servicio
                }
              })
              deptos[item.departamento.idDepartamento].servicioMasPopular = _maxSvc
              console.log(_maxSvc)
              info.servicios = _maxSvc.nombre
            }
          }
        }
        this.infoHistorico.push(info)          
        this.ingresosDeptoMes.data[0].dataPoints.push({ label: info.fecha,  y: info.ganancias  })
      }
      for (let svc in servicios) {
        this.ingresosServicios.data[0].dataPoints.push({label: servicios[svc].nombre, y: servicios[svc].valor})
      }
      this.ingresosDeptoMes = {
        width: 700,
        dataPointWidth: 20,
        axisX:{
          title: "Mes",
          interval: 1,
          labelAngle: -45
        },
        title: {
          text: "Ingresos por mes"
        },
        data: [{
          type: "column",
          dataPoints: this.ingresosDeptoMes.data[0].dataPoints
        }]	  
      };
      this.ingresosServicios = {
        title: {
          text: "Ingresos por servicios extra"
        },
        data: [{
          type: "doughnut",
          dataPoints: this.ingresosServicios.data[0].dataPoints
        }]	  
      }
      this.dataSource = new MatTableDataSource(this.infoHistorico)
      this.cdr.detectChanges();
    })
  }

  dialogOpen() {
    return (this.dialog.openDialogs.length == 0)
  }

}
