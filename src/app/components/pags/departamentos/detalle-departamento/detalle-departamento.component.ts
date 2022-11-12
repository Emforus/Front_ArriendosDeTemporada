import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { switchMap } from 'rxjs';
import { Departamento } from 'src/app/components/_models/departamento';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { LoaderService } from 'src/app/components/_services/loader.service';
import { DeptoService } from 'src/app/components/_services/depto.service';
import { ServicioGenerico } from 'src/app/components/_models/servicio.generico';


@Component({
  selector: 'app-detalle-departamento',
  templateUrl: './detalle-departamento.component.html',
  styleUrls: ['./detalle-departamento.component.css']
})
export class DetalleDepartamentoComponent implements OnInit {

  formatter = new Intl.NumberFormat('CL', {
    style: 'currency',
    currency: 'CLP'
  })
    //@ts-ignore
    depto: Departamento;
    //@ts-ignore
    servicios: ServicioGenerico;
    curimg: number = 0;
  
    constructor(
      private dialogRef: MatDialogRef<DetalleDepartamentoComponent>,
      @Inject(MAT_DIALOG_DATA) private data: Departamento,
      private dialog: MatDialog,
      private departamentoService: DeptoService,
      private cdr: ChangeDetectorRef,
      public loaderService: LoaderService,
    ) { }
  
    ngOnInit(): void {
      this.depto = new Departamento();
      this.depto.idDepartamento = this.data.idDepartamento;
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
      this.depto.serviciosPrincipales = this.data.serviciosPrincipales;
      this.servicios = new ServicioGenerico;
      this.servicios = this.data.serviciosPrincipales;
      this.depto.utilidades = this.data.utilidades;
      this.depto.facturas = this.data.facturas;

      console.log(this.servicios.hasWifi)
  
      this.cdr.detectChanges();
    }
  
    close() {
      this.dialogRef.close();
    }

    getColor(item: any) {
      if (item) {
        return '#00C767'
      }
      return '#FF3434'
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

}
