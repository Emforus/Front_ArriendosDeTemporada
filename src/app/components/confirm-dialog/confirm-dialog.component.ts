import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {


  constructor(
    private dialogo: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {mensaje: string, accion: string}
  ) { }

  rechazar() {
    this.dialogo.close({status: false})
  }

  confirmar() {
    this.dialogo.close({status: true})
  }

  ngOnInit(): void {
  }

}
