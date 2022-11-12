//@ts-nocheck
import { Factura } from "./factura";
import { Utilidad } from "./utilidad";
import { ServicioGenerico } from "./servicio.generico";
export class Departamento {
    idDepartamento: number;
    ubicacionDepartamento: string;
    regionDepartamento: string;
    valorBase: number;
    descripcionDepartamento: string;
    cantidadDormitorios: number;
    estado: string;
    fechaRegistroDepartamento: Date;
    fechaUltimaReserva: Date;
    fechaUltimaMantencion: Date;
    estadoLogico: boolean;
    fotografias: string[];
    utilidades: Utilidad[];
    facturas: Factura[];
    serviciosPrincipales: ServicioGenerico;
}