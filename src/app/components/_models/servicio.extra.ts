//@ts-nocheck
import { Departamento } from "./departamento"
import { Factura } from "./factura"

export class ServicioExtra {
    id: number
    nombre: string
    descripcion:string
    fechaContrato: Date
    fechaUltimaRenovacion: Date
    fechaExpiracion: Date
    estadoLogico: boolean
    costoServicio: number
    servicioUnitario: boolean
    facturas: Factura[]
    departamentos: Departamento[]
}