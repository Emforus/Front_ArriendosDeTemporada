import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { switchMap } from 'rxjs';
import { Usuario } from 'src/app/components/_models/usuario';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { LoaderService } from 'src/app/components/_services/loader.service';
import { UserService } from 'src/app/components/_services/user.service';
import { UserEditComponent } from '../user-edit/user-edit.component';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  //@ts-ignore
  user: Usuario;

  constructor(
    private dialogRef: MatDialogRef<UserDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Usuario,
    private dialog: MatDialog,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    public loaderService: LoaderService,
  ) { }

  ngOnInit(): void {
    this.user = new Usuario();
    this.user.id = this.data.id;
    this.user.uid = this.data.uid;
    this.user.rol = this.data.rol;
    this.user.email = this.data.email;
    this.user.nombreUsuario = this.data.nombreUsuario;
    this.user.fechaRegistroUsuario = this.data.fechaRegistroUsuario;
    this.user.lastLogOn = this.data.lastLogOn;
    this.user.estadoLogico = this.data.estadoLogico;

    console.log(this.user.estadoLogico)

    this.cdr.detectChanges();
  }

  close() {
    this.dialogRef.close();
  }

  enable() {
    this.dialog.open(ConfirmDialogComponent, {
      data: {mensaje: 'Esta seguro de que desea habilitar este usuario?', accion: 'habilitar'}
    }).afterClosed().subscribe((response: {status: boolean}) => {
      if (response.status) {
        this.userService.setEstadoUsuario(this.user.id).pipe(switchMap( ()=> {
          return this.userService.listar()
        })).subscribe(data => {
          this.userService.setUserChange(data);
        })
        this.close();
      }
    })
  }

  disable() {
    this.dialog.open(ConfirmDialogComponent, {
      data: {mensaje: 'Esta seguro de que desea deshabilitar este usuario?', accion: 'deshabilitar'}
    }).afterClosed().subscribe((response: {status: boolean}) => {
      if (response.status) {
        this.userService.setEstadoUsuario(this.user.id).pipe(switchMap( ()=> {
          return this.userService.listar()
        })).subscribe(data => {
          this.userService.setUserChange(data);
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
        this.userService.eliminar(this.user.id).pipe(switchMap( ()=> {
          return this.userService.listar()
        })).subscribe(data => {
          this.userService.setUserChange(data);
          this.close();
        })
      }
    })
  }
}
