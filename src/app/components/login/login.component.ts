import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { LoginService } from 'src/app/components/_services/login.service';
import { UserService } from '../_services/user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { LoaderService } from '../_services/loader.service';
import { AuthUtil } from '../_models/auth.util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // @ts-ignore
  aFormGroup: FormGroup;

  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private router: Router,
    private loginService: LoginService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
    ) { }

  ngOnInit(): void {
    this.aFormGroup = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  })
  }

  loginUser(){
    this.loginService.login(this.aFormGroup.value['username'], this.aFormGroup.value['password']).subscribe(data=>{
      if(data == true){
        this.getUserData()
        this.snackBar.open('Sesión iniciada exitosamente', 'Notificación', {duration: 4000,
        horizontalPosition: this.horizontalPosition, verticalPosition: this.verticalPosition})
      } else {
        this.snackBar.open('Solicitud incorrecta', 'Notificación', {duration: 4000,
        horizontalPosition: this.horizontalPosition, verticalPosition: this.verticalPosition})
      }
    })
  }

  getUserData() {
    this.userService.buscarUsuarioPorUsername(this.aFormGroup.value['username']).subscribe((data:any) => {
      try {
        let auth = new AuthUtil();
        auth.id = data['id'];
        auth.rol = data['rol'];
        auth.username = data['nombreUsuario'];
        this.loginService.setAuthData(auth);
        localStorage.setItem('id', data['id'])
        localStorage.setItem('fullname', data['nombreUsuario'])
        localStorage.setItem('rol', data['rol'])
        localStorage.setItem('authUser', this.aFormGroup.value['username'])
        this.router.navigate(['/home'])
      } catch (error) {
        console.log(error)
      }
    })
  }

  navegar() {
    this.router.navigate(['/registro']);
  }
}
