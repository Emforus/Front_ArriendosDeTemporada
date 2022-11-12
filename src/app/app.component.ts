import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginService } from './components/_services/login.service';
import { AuthUtil } from './components/_models/auth.util';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{


  
  title = 'TurismoReal';
  auth: AuthUtil = new AuthUtil();

  constructor(
    private loginService: LoginService
  ) { }

  ngOnInit() {
    if (localStorage.length>0) {
      this.loginService.isAuthenticated(true);
      this.auth.id = Number(localStorage.getItem('id')??0);
      this.auth.rol = localStorage.getItem('rol')??"";
      this.auth.username = localStorage.getItem('authUser')??"";
      this.loginService.setAuthData(this.auth)
    }
  }
}
