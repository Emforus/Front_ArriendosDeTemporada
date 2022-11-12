import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { switchMap } from 'rxjs';
import { Usuario } from 'src/app/components/_models/usuario';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { LoaderService } from 'src/app/components/_services/loader.service';
import { UserService } from 'src/app/components/_services/user.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  //@ts-ignore
  user: Usuario;

  constructor(
    private dialogRef: MatDialogRef<PerfilComponent>,
    private dialog: MatDialog,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    public loaderService: LoaderService
    ) { }

  ngOnInit(): void {
    this.userService.buscarUsuarioPorUsername(localStorage.getItem('authUser')??"").subscribe((data:any) => {
      this.user = data;
    })
  }
  
  close() {
    this.dialogRef.close();
  }

}
