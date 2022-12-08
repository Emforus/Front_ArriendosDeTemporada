import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { distinctUntilChanged, Observable, Subscription, tap } from 'rxjs';
import { LoginService } from '../_services/login.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout' 
import { AuthUtil } from '../_models/auth.util';

@Component({
  selector: 'app-navmenu',
  templateUrl: './navmenu.component.html',
  styleUrls: ['./navmenu.component.css']
})
export class NavmenuComponent implements OnInit {

  readonly breakpoint$ = this.breakpointObserver
  .observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, Breakpoints.Handset, '(min-width: 500px)'])
  .pipe(
    tap(value => console.log(value)),
    distinctUntilChanged()
  );

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
  currentBreakpoint:string = '';

  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private loginService: LoginService,
    private router: Router,
    private snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver
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
    this.breakpoint$.subscribe(() =>
      this.breakpointChanged()
    );
  }

  private breakpointChanged() {
    if(this.breakpointObserver.isMatched(Breakpoints.Large)) {
      this.currentBreakpoint = Breakpoints.Large;
    } else if(this.breakpointObserver.isMatched(Breakpoints.Medium)) {
      this.currentBreakpoint = Breakpoints.Medium;
    } else if(this.breakpointObserver.isMatched(Breakpoints.Small)) {
      this.currentBreakpoint = Breakpoints.Small;
    } else if(this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      this.currentBreakpoint = Breakpoints.Handset;
    } else if(this.breakpointObserver.isMatched('(min-width: 500px)')) {
      this.currentBreakpoint = '(min-width: 500px)';
    }
  }
  isHandset(): boolean {
    return this.currentBreakpoint==Breakpoints.Handset
  }

  logout() {
    this.loginService.isAuthenticated(false);
    localStorage.clear()
    let auth = new AuthUtil()
    this.loginService.setAuthData(auth);
    this.snackBar.open('Sesión cerrada exitosamente', 'Notificación', {duration: 4000,
    horizontalPosition: this.horizontalPosition, verticalPosition: this.verticalPosition})
    this.router.navigate(['/home'])
  }
}
