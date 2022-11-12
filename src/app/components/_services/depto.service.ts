import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Departamento } from '../_models/departamento';
import { Subject } from 'rxjs';
import { GenericService } from './generic.service';
import { Factura } from '../_models/factura';

@Injectable({
    providedIn: 'root'
})
export class DeptoService extends GenericService<Departamento> {

    private deptoChange = new Subject<Departamento[]>();
    constructor(protected override http:HttpClient) {
        super(
            http,
            'http://localhost:8080/api/departamentos'
        )
    }

    crearDepartamento(depto: Departamento){
        const httpHeaders = new HttpHeaders({
            'Content-Type':'application/json'
        })

        let response = this.http.post(this.url, depto, {headers: httpHeaders});
        return response
    }

    editarDepartamento(depto: Departamento){
        const httpHeaders = new HttpHeaders({
            'Content-Type':'application/json'
        })

        let response = this.http.put(`${this.url}/${depto.idDepartamento}`, depto, {headers: httpHeaders});
        return response
    }

    reservarDepartamento(factura: Factura){
        const httpHeaders = new HttpHeaders({
            'Content-Type':'application/json'
        })

        let response = this.http.post(`${this.url}/reservar`, factura, {headers: httpHeaders});
        return response
    }

    setEstadoDepartamento(id: number) {
        return this.http.get(`${this.url}/${id}/disable`)
    }

    getChange(){
        return this.deptoChange.asObservable();
    }

    setChange(depto: Departamento[]){
        this.deptoChange.next(depto)
    }

}