import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { LoginService } from '../_services/login.service';

@Component({
  selector: 'app-navmenu',
  templateUrl: './navmenu.component.html',
  styleUrls: ['./navmenu.component.css']
})
export class NavmenuComponent implements OnInit {
  storage: any;
  // @ts-ignore
  subscription: Subscription
  // @ts-ignore
  username: string;
  // @ts-ignore
  rol: string;
  // @ts-ignore
  id: number;
  authenticated: boolean = false;
  isLoaded:boolean = false;

  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private loginService: LoginService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.storage = localStorage;
    this.loginService.getAuthenticated().subscribe(data => {
      this.authenticated = data;
    })
    this.loginService.getAuthData().subscribe(data => {
      this.id = data.id;
      this.rol = data.rol;
      this.username = data.username;
    })
    console.log(this.username+' '+this.rol+' '+this.id)
  }

  logout() {
    this.loginService.isAuthenticated(false);
    localStorage.clear()
    this.ngOnInit()
    this.snackBar.open('Sesión cerrada exitosamente', 'Notificación', {duration: 4000,
    horizontalPosition: this.horizontalPosition, verticalPosition: this.verticalPosition})
    this.router.navigate(['/home'])
  }
}
