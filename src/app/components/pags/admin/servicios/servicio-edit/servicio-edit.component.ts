import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { switchMap } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { LoaderService } from 'src/app/components/_services/loader.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServicioExtra } from 'src/app/components/_models/servicio.extra';
import { ServicioService } from 'src/app/components/_services/servicio.service';

@Component({
  selector: 'app-servicio-edit',
  templateUrl: './servicio-edit.component.html',
  styleUrls: ['./servicio-edit.component.css']
})
export class ServicioEditComponent implements OnInit {

  //@ts-ignore
  svc: ServicioExtra;
  //@ts-ignore
  form: FormGroup;
  facturacion = [
    {value:'Individual'},
    {value:'Grupal'}
  ]

  defaultMinimo: Date = new Date()
  defaultMaximo: Date = new Date()

  constructor(
    private dialogRef: MatDialogRef<ServicioEditComponent>,
    @Inject(MAT_DIALOG_DATA) private data: ServicioExtra,
    private servicioService: ServicioService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.svc = new ServicioExtra();
    if (this.data.id != undefined) {
      this.svc.id = this.data.id;
      this.svc.nombre = this.data.nombre;
      this.svc.descripcion = this.data.descripcion;
      this.svc.costoServicio = this.data.costoServicio;
      this.svc.fechaContrato = this.data.fechaContrato;
      this.svc.fechaUltimaRenovacion = this.data.fechaUltimaRenovacion;
      this.svc.fechaExpiracion = this.data.fechaExpiracion;
      this.svc.estadoLogico = this.data.estadoLogico;
      this.svc.servicioUnitario = this.data.servicioUnitario;
    }
    this.defaultMinimo.setDate(this.defaultMinimo.getDate()+30)
    this.defaultMaximo.setDate(this.defaultMaximo.getDate()+90)
    this.form = this.formBuilder.group({
    nombre: [this.svc.nombre??null, [Validators.required, Validators.maxLength(40), Validators.pattern('[a-zA-ZÀ-ÿ\u00f1\u00d10-9_/ ]*')]],
    descripcion: [this.svc.descripcion??null, [Validators.required, Validators.maxLength(200), Validators.pattern('[a-zA-ZÀ-ÿ\u00f1\u00d10-9_ ]*')]],
    costoServicio: [this.svc.costoServicio??null, [Validators.required, Validators.pattern('[0-9]*')]],
    fechaContrato: [this.svc.fechaContrato??new Date(), [Validators.required]],
    fechaExpiracion: [this.svc.fechaExpiracion??this.defaultMaximo, [Validators.required]]
    })

  }
  
  hasError(control: string) {
    let error = null;
    if (this.form.controls[control].errors) {
      const first = Object.keys(this.form.controls[control].errors!)[0]
      switch (first) {
        case 'required':
          error={error:'Campo obligatorio'}
          break;
        case 'maxlength':
          error={error:'Máximo '+this.form.controls[control].errors!['maxlength'].requiredLength+' caracteres'}
          break;
        case 'pattern':
          error={error:'El campo presenta caracteres prohibidos'}
          break;
        case 'email':
          error={error:'Formato de correo inválido'}
          break;
      }
    }
    return error;
  }

  parseDates() {
    this.svc.fechaContrato = new Date(this.form.controls['fechaContrato'].value)
    this.svc.fechaExpiracion = new Date(this.form.controls['fechaExpiracion'].value)
  }
  
  editar() {
    if (this.form.invalid) {return;}
    this.parseDates()
    if (this.svc.id != (undefined&&null)) {
      console.log('Iniciando modificación de servicio')
      this.dialog.open(ConfirmDialogComponent, {
        data: {mensaje: '¿Está seguro de que los datos ingresados son los correctos?', accion: 'editar'}
      }).afterClosed().subscribe((response: {status:boolean}) => {
        if (response.status) {
          this.servicioService.editarServicio(this.svc).pipe(switchMap(()=>{
            return this.servicioService.listar()
          })).subscribe((data:any) => {
            this.servicioService.setChange(data)
          })
          this.close()
        }
      })
    } else {
    console.log('Iniciando registro de servicio')
    this.dialog.open(ConfirmDialogComponent, {
      data: {mensaje: '¿Está seguro de que los datos ingresados son los correctos?', accion: 'editar'}
    }).afterClosed().subscribe((response: {status:boolean}) => {
      if (response.status) {
        this.servicioService.crearServicio(this.svc).pipe(switchMap(()=>{
          return this.servicioService.listar()
        })).subscribe((data:any) => {
          this.servicioService.setChange(data)
        })
        this.close()
      }
    })
    }
  }
  
  close() {
    this.dialogRef.close();
  }
}
