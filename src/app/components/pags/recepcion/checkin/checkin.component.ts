import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { Departamento } from 'src/app/components/_models/departamento';
import { Factura } from 'src/app/components/_models/factura';
import { BookingService } from 'src/app/components/_services/booking.service';
import { LoaderService } from 'src/app/components/_services/loader.service';
import { LoginService } from 'src/app/components/_services/login.service';
import { UserService } from 'src/app/components/_services/user.service';

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.css']
})
export class CheckinComponent implements OnInit {


  formatter = new Intl.NumberFormat('CL', {
    style: 'currency',
    currency: 'CLP'
  })
  //@ts-ignore
  factura: Factura
  //@ts-ignore
  form: FormGroup
  metodos = [
    {value:'Efectivo'},
    {value:'Crédito'},
    {value:'Débito'},
    {value:'Otro'}
  ]

  constructor(
    private dialogRef: MatDialogRef<CheckinComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Factura,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private userService: UserService,
    public loaderService: LoaderService,
    private router: Router,
    private bookingService: BookingService,
    private cdr: ChangeDetectorRef
    ) { }

  ngOnInit(): void {
    this.factura = new Factura();
    this.factura.id = this.data.id
    this.factura.cantidadClientes = this.data.cantidadClientes
    this.factura.departamento = this.data.departamento
    this.factura.duracion = this.data.duracion
    this.factura.estado = this.data.estado
    this.factura.fechaHoraCheckIn = this.data.fechaHoraCheckIn
    this.factura.fechaHoraCheckOut = this.data.fechaHoraCheckOut
    this.factura.fechaHoraGeneracion = this.data.fechaHoraGeneracion
    this.factura.fechaHoraReserva = this.data.fechaHoraReserva
    this.factura.usuario = this.data.usuario
    this.factura.valor = this.data.valor
    this.factura.valorDeposito = this.data.valorDeposito
    this.factura.valorIVA = this.data.valorIVA
    this.factura.valorServicios = this.data.valorServicios
    this.factura.serviciosPorFactura = this.data.serviciosPorFactura

    this.form = this.formBuilder.group({
    nombreUsuario: [null, [Validators.required, Validators.maxLength(50), Validators.pattern('[a-zA-ZÀ-ÿ\u00f1\u00d10-9_ ]*')]],
    email: [null, [Validators.required, Validators.email]],
    metodoPago: [null, [Validators.required]],
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

  dialogOpen() {
    return (this.dialog.openDialogs.length == 0)
  }
  
  close() {
    this.dialogRef.close();
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

  checkIn() {
    if (this.form.invalid) {return;}
    console.log('Iniciando proceso de Check-In')
    console.log(this.factura)
    this.dialog.open(ConfirmDialogComponent, {
      data: {mensaje: '¿Está seguro de que los datos ingresados son los correctos?', accion: 'editar'}
    }).afterClosed().subscribe((response: {status:boolean}) => {
      if (response.status) {
        this.bookingService.checkIn(this.factura).pipe(switchMap(()=>{
          return this.bookingService.listar()
        })).subscribe((data:any) => {
          this.bookingService.setChange(data)
        })
        this.close()
      }
    })
  }
  
  cancel() {
    this.dialog.open(ConfirmDialogComponent, {
      data: {mensaje: '¿Está seguro de que desea anular esta reserva? Esto no se puede deshacer.', accion: 'eliminar'}
    }).afterClosed().subscribe((response: {status: boolean}) => {
      if (response.status) {
        this.bookingService.anularReserva(this.factura).pipe(switchMap( ()=> {
          return this.bookingService.listar()
        })).subscribe(data => {
          this.bookingService.setChange(data);
        })
      }
    })
    this.close()
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

}
