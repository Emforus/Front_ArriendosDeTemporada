import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { Usuario } from '../_models/usuario'; 

@Injectable({
    providedIn: 'root'
})
export class RegisterService {
    private urlRegister: string = 'http://localhost:8080/api/usuarios';

    constructor(
        private http: HttpClient,
        private router: Router
    ) {}

    register(usuario: Usuario) {
        const httpHeaders = new HttpHeaders({
            'Content-Type':'application/json'
        })

        let response = this.http.post<any>(this.urlRegister, usuario, {headers: httpHeaders});
        return response
    }
}