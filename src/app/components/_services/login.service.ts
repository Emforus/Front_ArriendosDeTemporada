import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '../_models/usuario';
import { AuthUtil } from '../_models/auth.util';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    private subject: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private util: BehaviorSubject<AuthUtil> = new BehaviorSubject( new AuthUtil());
    private urlLogin: string = 'http://localhost:8080/api/usuarios/login';

    constructor(
        private http: HttpClient,
        private router: Router
    ) {}

    getAuthenticated(): Observable<boolean> {
        return this.subject.asObservable();
    }
    isAuthenticated(flag: boolean) {
        this.subject.next(flag);
    }

    getAuthData(): Observable<AuthUtil> {
        return this.util.asObservable();
    }
    setAuthData(data: AuthUtil) {
        this.util.next(data);
    }

    login(user: string, password: string) {
        const httpHeaders = new HttpHeaders({
            'Content-Type':'application/json'
        })

        let params = {
            "username":user,
            "password":password
        }

        let response = this.http.post<any>(this.urlLogin, params, {headers: httpHeaders})
        response.subscribe(data=>{
            if(data['message'] == 'false'){
              this.isAuthenticated(false)
            } else {
              this.isAuthenticated(true)
            }
        })

        return response;
    }
}