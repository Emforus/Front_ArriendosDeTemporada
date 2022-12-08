import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Departamento } from '../_models/departamento';
import { Subject } from 'rxjs';
import { GenericService } from './generic.service';
import { Factura } from '../_models/factura';

@Injectable({
    providedIn: 'root'
})
export class BookingService extends GenericService<Factura> {

    private change = new Subject<Factura[]>();
    constructor(protected override http:HttpClient) {
        super(
            http,
            'http://localhost:8080/api/reservas'
        )
    }

    listarPorDepartamento(depto: number) {
        return this.http.get<Factura[]>(`${this.url}/departamento/${depto}`)
    }

    listarPorCliente(user: number) {
        return this.http.get<Factura[]>(`${this.url}/usuario/${user}`)
    }
    
    anularReserva(item: Factura) {
        const httpHeaders = new HttpHeaders({
            'Content-Type':'application/json'
        })

        let response = this.http.delete(`${this.url}/delete`, {headers: httpHeaders, body: item})
        return response
    }

    checkIn(item: Factura) {
        const httpHeaders = new HttpHeaders({
            'Content-Type':'application/json'
        })

        let response = this.http.put(`${this.url}/checkin`, item, {headers: httpHeaders})
        return response
    }

    checkOut(item: Factura) {
        const httpHeaders = new HttpHeaders({
            'Content-Type':'application/json'
        })

        let response = this.http.put(`${this.url}/checkout`, item, {headers: httpHeaders})
        return response
    }

    getChange(){
        return this.change.asObservable();
    }

    setChange(item: Factura[]){
        this.change.next(item)
    }

}