//@ts-nocheck
import { Departamento } from "./departamento";
import { ServicioFactura } from "./join.servicio.factura";
import { Usuario } from "./usuario";

export class Factura {
    id: number;
    fechaHoraGeneracion: Date;
    fechaHoraCheckIn: Date;
    fechaHoraCheckOut: Date;
    fechaHoraReserva: Date;
    duracion: number;
    estado: string;
    valor: number;
    valorIVA: number;
    valorDeposito: number;
    valorServicios: number;
    cantidadClientes: number;
    usuario: Usuario;
    departamento: Departamento;
    serviciosPorFactura: ServicioFactura[];
}