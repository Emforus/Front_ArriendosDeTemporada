import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { GenericService } from './generic.service';
import { ServicioExtra } from '../_models/servicio.extra';

@Injectable({
    providedIn: 'root'
})
export class ServicioService extends GenericService<ServicioExtra> {

    private svcChange = new Subject<ServicioExtra[]>();
    constructor(protected override http:HttpClient) {
        super(
            http,
            'http://localhost:8080/api/servicios'
        )
    }

    crearServicio(svc: ServicioExtra){
        const httpHeaders = new HttpHeaders({
            'Content-Type':'application/json'
        })

        let response = this.http.post(this.url, svc, {headers: httpHeaders});
        return response
    }

    editarServicio(svc: ServicioExtra){
        const httpHeaders = new HttpHeaders({
            'Content-Type':'application/json'
        })

        let response = this.http.put(`${this.url}/${svc.id}`, svc, {headers: httpHeaders});
        return response
    }

    getChange(){
        return this.svcChange.asObservable();
    }

    setChange(svc: ServicioExtra[]){
        this.svcChange.next(svc)
    }

}