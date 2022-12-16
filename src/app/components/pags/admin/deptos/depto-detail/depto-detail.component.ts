import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { switchMap } from 'rxjs/operators';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { AuthUtil } from 'src/app/components/_models/auth.util';
import { Departamento } from 'src/app/components/_models/departamento';
import { Factura } from 'src/app/components/_models/factura';
import { Utilidad } from 'src/app/components/_models/utilidad';
import { BookingService } from 'src/app/components/_services/booking.service';
import { DeptoService } from 'src/app/components/_services/depto.service';
import { LoaderService } from 'src/app/components/_services/loader.service';
import { LoginService } from 'src/app/components/_services/login.service';

@Component({
  selector: 'app-depto-detail',
  templateUrl: './depto-detail.component.html',
  styleUrls: ['./depto-detail.component.css']
})
export class DeptoDetailComponent implements OnInit {


    formatter = new Intl.NumberFormat('CL', {
      style: 'currency',
      currency: 'CLP'
    })
    //@ts-ignore
    depto: Departamento;
    curimg: number = 0;
    facturas: Factura[] = new Array()
    curUser: AuthUtil = new AuthUtil()
    
    displayedColumns = ['id', 'email', 'estado']
    dataSource!: MatTableDataSource<Factura>;
    inventario!: MatTableDataSource<Utilidad>;
  
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
  
    constructor(
      private dialogRef: MatDialogRef<DeptoDetailComponent>,
      @Inject(MAT_DIALOG_DATA) private data: Departamento,
      private dialog: MatDialog,
      private departamentoService: DeptoService,
      private cdr: ChangeDetectorRef,
      public loaderService: LoaderService,
      private bookingService: BookingService,
      private loginService: LoginService,

    ) { }
  
    ngOnInit(): void {
      this.depto = new Departamento();
      this.depto.idDepartamento = this.data.idDepartamento;
      this.depto.nombreDepartamento = this.data.nombreDepartamento;
      this.depto.descripcionDepartamento = this.data.descripcionDepartamento;
      this.depto.ubicacionDepartamento = this.data.ubicacionDepartamento;
      this.depto.regionDepartamento = this.data.regionDepartamento;
      this.depto.cantidadDormitorios = this.data.cantidadDormitorios;
      this.depto.estado = this.data.estado;
      this.depto.valorBase = this.data.valorBase;
      this.depto.fechaRegistroDepartamento = this.data.fechaRegistroDepartamento;
      this.depto.fechaUltimaReserva = this.data.fechaUltimaReserva;
      this.depto.fechaUltimaMantencion = this.data.fechaUltimaMantencion;
      this.depto.estadoLogico = this.data.estadoLogico;
      this.depto.fotografias = this.data.fotografias;
      this.depto.utilidades = this.data.utilidades;
      this.depto.facturas = this.data.facturas;
      this.depto.serviciosPrincipales = this.data.serviciosPrincipales
  
      this.loginService.getAuthData().subscribe(data => {
        this.curUser.id = data.id;
        this.curUser.rol = data.rol;
        this.curUser.username = data.username;
      })
      this.bookingService.listarPorDepartamento(this.depto.idDepartamento).subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort
        this.dataSource.paginator = this.paginator
      })
      // this.departamentoService.getUtilidades(this.depto.idDepartamento).subscribe((data: any) => {
      //   this.inventario = new MatTableDataSource(data);
      //   this.inventario.sort = this.sort
      //   this.inventario.paginator = this.paginator
      // })
      this.inventario = new MatTableDataSource(this.depto.utilidades)
      this.inventario.sort = this.sort
      this.inventario.paginator = this.paginator
      this.cdr.detectChanges();
    }

    dialogOpen() {
      return (this.dialog.openDialogs.length == 0)
    }
  
    close() {
      this.dialogRef.close();
    }

    img_next() {
      this.curimg += 1;
      if (this.curimg >= this.depto.fotografias.length) {
        this.curimg = 0;
      }
      this.cdr.detectChanges();
    }
    img_prev() {
      this.curimg -= 1;
      if (this.curimg < 0) {
        this.curimg = this.depto.fotografias.length-1;
      }
      this.cdr.detectChanges();
    }

    getColor(item: any) {
      if (item) {
        return '#00C767'
      }
      return '#FF3434'
    }

    enable() {
      this.dialog.open(ConfirmDialogComponent, {
        data: {mensaje: '¿Está seguro de que desea habilitar este usuario?', accion: 'habilitar'}
      }).afterClosed().subscribe((response: {status: boolean}) => {
        if (response.status) {
          this.departamentoService.setEstadoDepartamento(this.depto.idDepartamento).pipe(switchMap( ()=> {
            return this.departamentoService.listar()
          })).subscribe(data => {
            this.departamentoService.setChange(data);
          })
          this.close();
        }
      })
    }
  
    disable() {
      this.dialog.open(ConfirmDialogComponent, {
        data: {mensaje: '¿Está seguro de que desea deshabilitar este usuario?', accion: 'deshabilitar'}
      }).afterClosed().subscribe((response: {status: boolean}) => {
        if (response.status) {
          this.departamentoService.setEstadoDepartamento(this.depto.idDepartamento).pipe(switchMap( ()=> {
            return this.departamentoService.listar()
          })).subscribe(data => {
            this.departamentoService.setChange(data);
          })
          this.close();
        }
      })
    }
  
    delete() {
      this.dialog.open(ConfirmDialogComponent, {
        data: {mensaje: '[IMPORTANTE] Esta a punto de eliminar esta cuenta, esta accion no se puede deshacer. Esta seguro?', accion: 'eliminar'}
      }).afterClosed().subscribe((response: {status: boolean}) => {
        if (response.status) {
          this.departamentoService.eliminar(this.depto.idDepartamento).pipe(switchMap( ()=> {
            return this.departamentoService.listar()
          })).subscribe(data => {
            this.departamentoService.setChange(data);
            this.close();
          })
        }
      })
    }

}
