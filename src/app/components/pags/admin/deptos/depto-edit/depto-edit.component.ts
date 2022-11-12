import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Usuario } from 'src/app/components/_models/usuario';
import { LoaderService } from 'src/app/components/_services/loader.service';
import { UserService } from 'src/app/components/_services/user.service';
import { UserEditComponent } from '../../users/user-edit/user-edit.component';

@Component({
  selector: 'app-depto-edit',
  templateUrl: './depto-edit.component.html',
  styleUrls: ['./depto-edit.component.css']
})
export class DeptoEditComponent implements OnInit {


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
  }

}
