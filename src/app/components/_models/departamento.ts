//@ts-nocheck
import { Factura } from "./factura";
import { Utilidad } from "./utilidad";
import { ServicioGenerico } from "./servicio.generico";
import { ServicioDepartamento } from "./join.servicio.departamento";
export class Departamento {
    idDepartamento: number;
    nombreDepartamento: string;
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
    serviciosDisponibles: ServicioDepartamento[];
}