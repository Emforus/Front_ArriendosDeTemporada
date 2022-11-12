import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from '../_models/usuario';
import { Subject } from 'rxjs';
import { GenericService } from './generic.service';

@Injectable({
    providedIn: 'root'
})
export class UserService extends GenericService<Usuario> {

    private userChange = new Subject<Usuario[]>();
    constructor(protected override http:HttpClient) {
        super(
            http,
            'http://localhost:8080/api/usuarios'
        )
    }

    crearUsuario(user: Usuario){
        const httpHeaders = new HttpHeaders({
            'Content-Type':'application/json'
        })

        let response = this.http.post(this.url, user, {headers: httpHeaders});
        return response
    }

    editarUsuario(user: Usuario){
        const httpHeaders = new HttpHeaders({
            'Content-Type':'application/json'
        })

        let response = this.http.put(`${this.url}/${user.id}`, user, {headers: httpHeaders});
        return response
    }

    cambiarContraseña(user: string, password: string){
        const httpHeaders = new HttpHeaders({
            'Content-Type':'application/json'
        })

        let params = {
            "username":user,
            "password":password
        }

        let response = this.http.put(`${this.url}/${user}/changePassword`, params, {headers: httpHeaders});
        return response
    }

    buscarUsuarioPorUsername(username: string) {
        return this.http.get(`${this.url}/${username}`)
    }

    setEstadoUsuario(id: number) {
        return this.http.get(`${this.url}/${id}/disable`)
    }

    getUserChange(){
        return this.userChange.asObservable();
    }

    setUserChange(user: Usuario[]){
        this.userChange.next(user)
    }

}