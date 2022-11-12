import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { switchMap } from 'rxjs';
import { Usuario } from 'src/app/components/_models/usuario';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { LoaderService } from 'src/app/components/_services/loader.service';
import { UserService } from 'src/app/components/_services/user.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  //@ts-ignore
  user: Usuario;
  //@ts-ignore
  form: FormGroup;
  roles = [
    {value:'Cliente'},
    {value:'Admin'},
    {value:'Mantenedor'},
    {value:'Recepcionista'},
    {value:'Personal'}
  ]

  constructor(
    private dialogRef: MatDialogRef<UserEditComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Usuario,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
    uid: [null, [Validators.required, Validators.maxLength(25), Validators.pattern('[a-zA-ZÀ-ÿ\u00f1\u00d10-9_]*')]],
    email: [null, [Validators.required, Validators.email]],
    rol: [null, [Validators.required]],
    nombreUsuario: [null, [Validators.required, Validators.maxLength(50), Validators.pattern('[a-zA-ZÀ-ÿ\u00f1\u00d10-9_ ]*')]]
  })
    this.user = new Usuario();
    this.user.id = this.data.id;
    this.user.uid = this.data.uid;
    this.user.rol = this.data.rol;
    this.user.email = this.data.email;
    this.user.nombreUsuario = this.data.nombreUsuario;
    this.user.fechaRegistroUsuario = this.data.fechaRegistroUsuario;
    this.user.lastLogOn = this.data.lastLogOn;
    this.user.estadoLogico = this.data.estadoLogico;
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
          error={error:'El campo presenta caracteres prohibidos'}
          break;
        case 'email':
          error={error:'Formato de correo invalido'}
          break;
      }
    }
    return error;
  }
  
  editar() {
    if (this.form.invalid) {return;}
    console.log('Iniciando registro de usuario')
    this.dialog.open(ConfirmDialogComponent, {
      data: {mensaje: 'Esta seguro de que los datos ingresados son los correctos?', accion: 'editar'}
    }).afterClosed().subscribe((response: {status:boolean}) => {
      if (response.status) {
        this.userService.editarUsuario(this.user).pipe(switchMap(()=>{
          return this.userService.listar()
        })).subscribe((data:any) => {
          this.userService.setUserChange(data)
        })
        this.close()
      }
    })
  }
  
  close() {
    this.dialogRef.close();
  }
}
