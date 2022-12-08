//@ts-nocheck
import { Factura } from "./factura";
import { ServicioExtra } from "./servicio.extra";

export class ServicioFactura {
    valorServicio: number
    idServicio: number
    idFactura: number
    servicio: ServicioExtra
    factura: Factura
}