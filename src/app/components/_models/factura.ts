//@ts-nocheck
import { Departamento } from "./departamento";
import { Usuario } from "./usuario";

export class Factura {
    id: number;
    fechaHoraGeneracion: Date;
    fechaHoraCheckIn: Date;
    fechaHoraCheckOut: Date;
    fechaHoraReserva: Date;
    duracion: number;
    estado: string;
    valorIVA: number;
    valorTotal: number;
    cantidadClientes: number;
    usuario: Usuario;
    departamento: Departamento;
}