import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService } from '../_services/register.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Usuario } from '../_models/usuario';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderService } from '../_services/loader.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  // @ts-ignore
  aFormGroup: FormGroup;
  // @ts-ignore
  usuario: Usuario;

  constructor(
    private router: Router,
    private registerService: RegisterService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    public loaderService: LoaderService
    ) { }

  ngOnInit(): void {
    this.aFormGroup = this.formBuilder.group({
    uid: [null, [Validators.required, Validators.maxLength(25), Validators.pattern('[a-zA-zÀ-ÿ\u00f1\u00d10-9_]*')]],
    email: [null, [Validators.required, Validators.email]],
    nombre: [null, [Validators.required, Validators.maxLength(25), Validators.pattern('[a-zA-zÀ-ÿ\u00f1\u00d10-9_]*')]],
    apellido: [null, [Validators.required, Validators.maxLength(25), Validators.pattern('[a-zA-zÀ-ÿ\u00f1\u00d10-9_]*')]],
    password: [null, [Validators.required, Validators.maxLength(25)]],
    password2: [null, [Validators.required, this.checkPasswords]]
  })
    this.usuario = new Usuario();
  }

  checkPasswords: ValidatorFn = (control: AbstractControl):  ValidationErrors | null => { 
    let pass = control.parent?.get('password')!.value;
    let confirmPass = control.value
    return pass === confirmPass ? null : { notSame: true }
  }

  registrar() {
    if (this.aFormGroup.invalid) {return;}
    console.log('Iniciando registro de usuario')
    this.dialog.open(ConfirmDialogComponent, {
      data: {mensaje: '¿Estás seguro de que los datos ingresados son los correctos?', accion: 'editar'}
    }).afterClosed().subscribe((response: {status:boolean}) => {
      if (response.status) {
        this.usuario.uid = this.aFormGroup.controls['uid'].value
        this.usuario.email = this.aFormGroup.controls['email'].value
        this.usuario.nombreUsuario = (this.aFormGroup.controls['nombre'].value+' '+this.aFormGroup.controls['apellido'].value)
        this.usuario.passwordHash = this.aFormGroup.controls['password'].value
        this.registerService.register(this.usuario).subscribe(data=>{
          if(data){
            console.log('usuario registrado')
            this.snackBar.open("Cuenta registrada exitosamente", 'Notificación', {duration: 10000,
            horizontalPosition: 'right', verticalPosition: 'top'})
            this.router.navigate(['/home'])
          } else {
            this.router.navigate(['/registro'])
          }
        })
      }
    })
  }

  hasError(control: string) {
    let error = null;
    if (this.aFormGroup.controls[control].errors) {
      const first = Object.keys(this.aFormGroup.controls[control].errors!)[0]
      switch (first) {
        case 'required':
          error={error:'Campo obligatorio'}
          break;
        case 'maxlength':
          error={error:'Maximo '+this.aFormGroup.controls[control].errors!['maxlength'].requiredLength+' caracteres'}
          break;
        case 'pattern':
          error={error:'El campo presenta caracteres prohibidos'}
          break;
        case 'email':
          error={error:'Formato de correo inválido'}
          break;
        case 'notSame':
          error={error:'Las contraseñas no coinciden'}
          break;
      }
    }
    return error;
  }

}
