import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { switchMap } from 'rxjs';
import { Departamento } from 'src/app/components/_models/departamento';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { LoaderService } from 'src/app/components/_services/loader.service';
import { DeptoService } from 'src/app/components/_services/depto.service';
import { Factura } from 'src/app/components/_models/factura';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginService } from 'src/app/components/_services/login.service';
import { Usuario } from 'src/app/components/_models/usuario';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

declare var paypal: any;

@Component({
  selector: 'app-arriendo',
  templateUrl: './arriendo.component.html',
  styleUrls: ['./arriendo.component.css']
})
export class ArriendoComponent implements OnInit {

  formatter = new Intl.NumberFormat('CL', {
    style: 'currency',
    currency: 'CLP'
  })
  //@ts-ignore
  form: FormGroup;
  //@ts-ignore
  depto: Departamento;
  //@ts-ignore
  factura: Factura = new Factura();
  //@ts-ignore
  user: Usuario = new Usuario();
  duracion: number = 0;
  iva: number = 0;
  deposito: number = 0;
  fechaMinima: Date = new Date();
  fechaMaxima: Date = new Date();
  filtro: any;

  //@ts-ignore
  @ViewChild('paypal', {static: true}) paypalElement: ElementRef;

  

  arriendo = { 
    desc: 'Departamento a arrendar',
    price: 100,
    img: ""
  }

  constructor(
    private dialogRef: MatDialogRef<ArriendoComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Departamento,
    private dialog: MatDialog,
    private departamentoService: DeptoService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    public loaderService: LoaderService,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
    // fechaCheckIn: [null, [Validators.required, Validators.pattern(/^\d{4}\/(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])$/)]],
    // fechaCheckOut: [null, [Validators.required, Validators.pattern(/^\d{4}\/(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])$/)]],
    fechaCheckIn: [null, [Validators.required]],
    fechaCheckOut: [null, [Validators.required]],
    cantidadClientes: [null, [Validators.required, Validators.pattern('[1-9]')]]
  })
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
    this.depto.utilidades = this.data.utilidades;
    this.depto.facturas = this.data.facturas;

    this.loginService.getAuthData().subscribe(data => {
      this.user.id = data.id;
      this.user.rol = data.rol;
      this.user.nombreUsuario = data.username;
    })
    this.fechaMinima.setDate(this.fechaMinima.getDate()+1)
    this.fechaMaxima.setDate(this.fechaMaxima.getDate()+28)

    paypal.Buttons({
      style: {
        layout: 'horizontal',
        color: 'blue',
        height: 35,
        label: 'paypal'
      },
      onClick: (data: any, actions: any) => {
        if (this.form.invalid) {
          return actions.reject()
        } else {
          this.arriendo.price = Math.round((this.deposito)/900)
          return actions.resolve()
        }
      },
      createOrder: (data: any, actions: any ) => {
        return actions.order.create({
          purchase_units: [
            {
              description: this.arriendo.desc,
              amount: {
                currency_code: 'USD',
                value: this.arriendo.price
              }
            }
          ]
        })
      },
      onApprove: async (data: any, actions: any) => {
        const order = await actions.order.capture()
        console.log(order)
        
      },
      onError: (err:any) => {
        console.log(err)
      }
    })
    .render(this.paypalElement.nativeElement);

    this.cdr.detectChanges();
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
          error={error:'Maximo '+this.form.controls[control].errors!['maxlength'].requiredLength+' caracteres'}
          break;
        case 'pattern':
          error={error:'Valor invalido.'}
          break;
        case 'email':
          error={error:'Formato de correo invalido'}
          break;
      }
    }
    return error;
  }

  setDuracion() {
    if (!this.form.controls['fechaCheckIn'].value) {return;}
    if (!this.form.controls['fechaCheckOut'].value) {return;}
    let date1 = new Date(this.form.controls['fechaCheckIn'].value)
    let date2 = new Date(this.form.controls['fechaCheckOut'].value)
    this.duracion = Math.floor((Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate()) - Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate()) ) /(1000 * 60 * 60 * 24));
    this.iva = this.depto.valorBase*this.duracion*0.19
    this.deposito = (this.depto.valorBase*this.duracion+this.iva)*0.2
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
  
  arrendar() {
    if (this.form.invalid) {return;}
    console.log('Iniciando arriendo de departamento')
    this.factura.cantidadClientes = Number(this.form.controls['cantidadClientes'].value??1)
    this.factura.valorIVA = this.iva
    this.factura.fechaHoraReserva = new Date(this.form.controls['fechaCheckIn'].value)
    this.factura.duracion = this.duracion;
    this.factura.estado = "Incompleta";
    this.factura.departamento = this.depto
    this.factura.usuario = this.user
    this.dialog.open(ConfirmDialogComponent, {
      data: {mensaje: '¿Esta seguro de que los datos ingresados son los correctos?', accion: 'editar'}
    }).afterClosed().subscribe((response: {status:boolean}) => {
      if (response.status) {
        this.departamentoService.reservarDepartamento(this.factura).pipe(switchMap(()=>{
          return this.departamentoService.listar()
        })).subscribe((data:any) => {
          this.departamentoService.setChange(data)
        })
        this.close()
      }
    })
    
  }
  test(){
  this.deposito = (this.depto.valorBase*this.duracion+this.iva)*0.2
  console.log(this.deposito);
  }

}
