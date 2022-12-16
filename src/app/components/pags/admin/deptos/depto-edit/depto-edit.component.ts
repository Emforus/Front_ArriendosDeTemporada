import { ChangeDetectorRef, Component, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { switchMap } from 'rxjs/operators';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { Departamento } from 'src/app/components/_models/departamento';
import { ServicioDepartamento } from 'src/app/components/_models/join.servicio.departamento';
import { ServicioExtra } from 'src/app/components/_models/servicio.extra';
import { ServicioGenerico } from 'src/app/components/_models/servicio.generico';
import { Usuario } from 'src/app/components/_models/usuario';
import { Utilidad } from 'src/app/components/_models/utilidad';
import { DeptoService } from 'src/app/components/_services/depto.service';
import { LoaderService } from 'src/app/components/_services/loader.service';
import { ServicioService } from 'src/app/components/_services/servicio.service';

@Component({
  selector: 'app-depto-edit',
  templateUrl: './depto-edit.component.html',
  styleUrls: ['./depto-edit.component.css']
})
export class DeptoEditComponent implements OnInit {

  
  formatter = new Intl.NumberFormat('CL', {
    style: 'currency',
    currency: 'CLP'
  })
  //@ts-ignore
  depto: Departamento;
  //@ts-ignore
  form: FormGroup;
  //@ts-ignore
  utilForm: FormGroup;
  //@ts-ignore
  svcControl: FormControl;
  estados = [
    {value:'Disponible'},
    {value:'Reservado'},
    {value:'En Mantenimiento'},
    {value:'En Uso'}
  ]
  estadosUtilidades = [
    {value:'Disponible'},
    {value:'Dañado'},
    {value:'Extraviado'}
  ]
  regiones = [
    {value:'I Región de Tarapacá'},
    {value:'II Región de Antofagasta'},
    {value:'III Región de Atacama'},
    {value:'IV Región de Coquimbo'},
    {value:'V Región de Valparaíso'},
    {value:'VI Región de O’Higgins'},
    {value:'VII Región del Maule'},
    {value:'VIII Región del Bío-bío'},
    {value:'IX Región de La Araucanía'},
    {value:'X Región de Los Lagos'},
    {value:'XI Región de Aysén'},
    {value:'XII Región de Magallanes'},
    {value:'RM Región Metropolitana'},
    {value:'XIV Región de Los Ríos'},
    {value:'XV Región de Arica y Parinacota'},
    {value:'XVI Región de Ñuble'},
  ]
  editar: boolean = false;
  selectedImage: number = -1
  selectedItem: number = -1
  inventario!: MatTableDataSource<Utilidad>;
  allServices: ServicioExtra[] = new Array<ServicioExtra>()
  unselectedServices: ServicioExtra[] = new Array<ServicioExtra>()
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChildren(MatTable) table!: QueryList<MatTable<any>>;

  constructor(
    private dialogRef: MatDialogRef<DeptoEditComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Departamento,
    private deptoService: DeptoService,
    private servicioService: ServicioService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.depto = new Departamento
    if (this.data.idDepartamento != undefined) {
      this.editar = true
      this.depto.idDepartamento = this.data.idDepartamento
      this.depto.nombreDepartamento = this.data.nombreDepartamento
      this.depto.descripcionDepartamento = this.data.descripcionDepartamento
      this.depto.ubicacionDepartamento = this.data.ubicacionDepartamento
      this.depto.regionDepartamento = this.data.regionDepartamento
      this.depto.fechaRegistroDepartamento = this.data.fechaRegistroDepartamento
      this.depto.fechaUltimaMantencion = this.data.fechaUltimaMantencion
      this.depto.fechaUltimaReserva = this.data.fechaUltimaReserva
      this.depto.estado = this.data.estado
      this.depto.valorBase = this.data.valorBase
      this.depto.estadoLogico = this.data.estadoLogico
      this.depto.fotografias = this.data.fotografias
      this.depto.cantidadDormitorios = this.data.cantidadDormitorios
      this.depto.facturas = this.data.facturas
      // this.deptoService.getUtilidades(this.depto.idDepartamento).subscribe((data: any) => {
      //   this.depto.utilidades = data
      //   this.inventario = new MatTableDataSource(data);
      //   this.inventario.sort = this.sort
      //   this.inventario.paginator = this.paginator
      // })
      this.depto.utilidades = this.data.utilidades
      this.inventario = new MatTableDataSource(this.depto.utilidades)
      this.inventario.sort = this.sort
      this.inventario.paginator = this.paginator
    }
    this.depto.serviciosDisponibles = this.data.serviciosDisponibles??new Array<ServicioExtra>();
    this.servicioService.listar().subscribe((data:any) => {
      this.allServices = data
      this.unselectedServices = data.filter((x:ServicioExtra) => {
        let _exists = false
        this.depto.serviciosDisponibles.forEach(item => {
          if (item.idServicio == x.id) {_exists=true; console.log(x.id)}
        });
        return !_exists;
      })
    })
    this.depto.serviciosPrincipales = this.data.serviciosPrincipales??new ServicioGenerico()
    this.depto.utilidades = this.data.utilidades??new Array<Utilidad>()
    this.form = this.formBuilder.group({
      nombre: [this.depto.nombreDepartamento??null, [Validators.required, Validators.maxLength(40), Validators.pattern('[a-zA-ZÀ-ÿ\u00f1\u00d10-9_ ]*')]],
      ubicacion: [this.depto.ubicacionDepartamento??null, [Validators.required, Validators.maxLength(40), Validators.pattern('[a-zA-ZÀ-ÿ\u00f1\u00d10-9,-_.,°# ]*')]],
      region: [this.depto.regionDepartamento??null, [Validators.required]],
      descripcion: [this.depto.descripcionDepartamento??null, [Validators.required, Validators.maxLength(200), Validators.pattern('[a-zA-ZÀ-ÿ\u00f1\u00d10-9,-_.,\' ]*')]],
      valorBase: [this.depto.valorBase??null, [Validators.required, Validators.pattern('[0-9]*')]],
      cantidadDormitorios: [this.depto.cantidadDormitorios??null, [Validators.required, Validators.pattern('[0-9]*')]],
      estado: [this.depto.estado??null, [Validators.required]]
    })
    this.utilForm = this.formBuilder.group({
      nombre: [null, [Validators.required, Validators.maxLength(50), Validators.pattern('[a-zA-ZÀ-ÿ\u00f1\u00d10-9_, ]*')]],
      descripcion: [null, [Validators.required, Validators.maxLength(200), Validators.pattern('[a-zA-ZÀ-ÿ\u00f1\u00d10-9,-_.,\' ]*')]],
      valor: [null, [Validators.required, Validators.pattern('[0-9]*')]],
      cantidad: [null, [Validators.required, Validators.pattern('[0-9]*')]],
      estado: [null, [Validators.required]]
    })
    this.svcControl = new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.pattern('[a-zA-ZÀ-ÿ\u00f1\u00d10-9_, ]*')])
    this.cdr.detectChanges()
  }

  getColor(item: any) {
    if (item) {
      return '#00C767'
    }
    return '#FF3434'
  }
  trackByFn(index: any, item: any) {
    return index;
  }

  hasError(form:FormGroup, control: string) {
    let error = null;
    if (form.controls[control].errors) {
      const first = Object.keys(form.controls[control].errors!)[0]
      switch (first) {
        case 'required':
          error={error:'Campo obligatorio'}
          break;
        case 'maxlength':
          error={error:'Maximo '+form.controls[control].errors!['maxlength'].requiredLength+' caracteres'}
          break;
        case 'pattern':
          error={error:'El campo presenta caracteres prohibidos'}
          break;
        case 'email':
          error={error:'Formato de correo invalido'}
          break;
      }
    }
    return error;
  }
  svcError(control: AbstractControl) {
    let error = null;
    if (control.errors) {
      const first = Object.keys(control.errors!)[0]
      switch (first) {
        case 'required':
          error={error:'Campo obligatorio'}
          break;
        case 'maxlength':
          error={error:'Maximo '+control.errors!['maxlength'].requiredLength+' caracteres'}
          break;
        case 'pattern':
          error={error:'El campo presenta caracteres prohibidos'}
          break;
        case 'email':
          error={error:'Formato de correo invalido'}
          break;
      }
    }
    return error;
  }

  isSelected(img: number): boolean {
    return this.selectedImage==img
  }
  utilSelected(util: number): boolean {
    return this.selectedItem==util
  }
  selectUtil(util: number) {
    this.selectedItem=util
    this.utilForm.controls['nombre'].setValue(this.depto.utilidades[util].nombre)
    this.utilForm.controls['descripcion'].setValue(this.depto.utilidades[util].descripcion)
    this.utilForm.controls['valor'].setValue(this.depto.utilidades[util].valor)
    this.utilForm.controls['cantidad'].setValue(this.depto.utilidades[util].cantidad)
    this.utilForm.controls['estado'].setValue(this.depto.utilidades[util].estado)
  }

  enableService(svc:any) {
    console.log(svc.id)
    this.unselectedServices.splice(this.unselectedServices.indexOf(svc), 1)
    let ds = new ServicioDepartamento()
    ds.idDepartamento=this.depto.idDepartamento??0
    ds.idServicio=svc.id
    ds.servicio=svc
    this.depto.serviciosDisponibles.push(ds)
    this.cdr.detectChanges()
    this.table.toArray().forEach(x => x.renderRows())
  }
  disableService(svc:any) {
    console.log(svc.servicio.id)
    this.depto.serviciosDisponibles.splice(this.depto.serviciosDisponibles.indexOf(svc), 1)
    this.unselectedServices.push(svc.servicio)
    this.cdr.detectChanges()
    this.table.toArray().forEach(x => x.renderRows())
  }

  addService() {
    if (!this.depto.serviciosPrincipales.otherServices) {
      this.depto.serviciosPrincipales.otherServices = new Array<string>()
    }
    this.depto.serviciosPrincipales.otherServices.push("")
  }
  delService(service: string) {
    let svc = this.depto.serviciosPrincipales.otherServices.indexOf(service)
    this.depto.serviciosPrincipales.otherServices.splice(svc, 1)
  }

  newUtil() {
    this.selectUtil(this.depto.utilidades.push(new Utilidad())-1)
    this.inventario = new MatTableDataSource(this.depto.utilidades);
    this.inventario.sort = this.sort
    this.inventario.paginator = this.paginator
  }
  deleteUtil(util: number) {
    this.selectedItem=-1
    this.utilForm.reset()
    this.depto.utilidades.splice(util, 1)
    this.inventario = new MatTableDataSource(this.depto.utilidades);
    this.inventario.sort = this.sort
    this.inventario.paginator = this.paginator
  }
  updateUtil(util: number) {
    if (this.utilForm.invalid) {return;}
    let u = this.depto.utilidades[util]
    u.nombre = this.utilForm.controls['nombre'].value
    u.descripcion = this.utilForm.controls['descripcion'].value
    u.valor = this.utilForm.controls['valor'].value
    u.cantidad = this.utilForm.controls['cantidad'].value
    u.estado = this.utilForm.controls['estado'].value
  }

  uploadImage(event: Event) {
    var target = event.target as HTMLInputElement;
    this.depto.fotografias ??= new Array<string>()
    if (target.files && target.files.length > 0) {
      this.depto.fotografias.push(target.files[0].name)
    }
  }
  removeImage() {
    this.depto.fotografias.splice(this.selectedImage, 1)
  }

  operar() {
    if (this.form.invalid) {return;}
    if (this.depto.fotografias == null || this.depto.fotografias.length == 0) {
      this.depto.fotografias = new Array<string>()
      this.depto.fotografias.push('NotFound.png')
    }
    if (!this.editar) {
      console.log('Iniciando creacion de departamento')
      this.dialog.open(ConfirmDialogComponent, {
        data: {mensaje: '¿Está seguro de que los datos ingresados son los correctos?', accion: 'crear'}
      }).afterClosed().subscribe((response: {status:boolean}) => {
        if (response.status) {
          this.deptoService.crearDepartamento(this.depto).pipe(switchMap(()=>{
            return this.deptoService.listar()
          })).subscribe((data:any) => {
            this.deptoService.setChange(data)
          })
          this.close()
        }
      })
    } else {
      console.log('Iniciando modificacion de departamento')
      console.log(this.depto.utilidades)
      this.dialog.open(ConfirmDialogComponent, {
        data: {mensaje: '¿Está seguro de que los datos ingresados son los correctos?', accion: 'editar'}
      }).afterClosed().subscribe((response: {status:boolean}) => {
        if (response.status) {
          this.deptoService.editarDepartamento(this.depto).pipe(switchMap(()=>{
            return this.deptoService.listar()
          })).subscribe((data:any) => {
            this.deptoService.setChange(data)
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
