import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from '../../../_models/usuario';
import { UserService } from 'src/app/components/_services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { LoaderService } from 'src/app/components/_services/loader.service';
import { MatTableDataSource } from '@angular/material/table';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  //@ts-ignore
  user: Usuario;

  displayedColumns = ['uid', 'nombreUsuario', 'email', 'rol', 'fechaRegistroUsuario', 'lastLogOn', 'estadoLogico', 'acciones']
  dataSource!: MatTableDataSource<Usuario>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    public loaderService: LoaderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('rol')!='Admin') {
      this.router.navigate(['**'])
    }

    this.userService.getUserChange().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort
      this.dataSource.paginator = this.paginator
    })

    this.userService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort
      this.dataSource.paginator = this.paginator
    })
  }

  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }

  dialogOpen() {
    return (this.dialog.openDialogs.length == 0)
  }

  formatDate(date: Date) {
    date = new Date(date);
    return [
      this.padTo2Digits(date.getDate()),
      this.padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join('/');
  }

  detail(element: any) {
    this.user = new Usuario();
    this.user.id = element.id;
    this.user.uid = element.uid;
    this.user.email = element.email;
    this.user.rol = element.rol;
    this.user.fechaRegistroUsuario = element.fechaRegistroUsuario;
    this.user.lastLogOn = element.lastLogOn;
    this.user.nombreUsuario = element.nombreUsuario;
    this.user.estadoLogico = element.estadoLogico;
    this.user.facturas = element.facturas;

    this.dialog.open(UserDetailComponent, {
      height: '95%',
      width: '50%',
      autoFocus: false,
      data: this.user
    })
  }

  edit(element: any) {
    this.user = new Usuario();
    this.user.id = element.id;
    this.user.uid = element.uid;
    this.user.email = element.email;
    this.user.rol = element.rol;
    this.user.fechaRegistroUsuario = element.fechaRegistroUsuario;
    this.user.lastLogOn = element.lastLogOn;
    this.user.nombreUsuario = element.nombreUsuario;
    this.user.estadoLogico = element.estadoLogico;
    this.user.facturas = element.facturas;

    this.dialog.open(UserEditComponent, {
      height: '95%',
      width: '60%',
      autoFocus: false,
      data: this.user
    })
  }

}
