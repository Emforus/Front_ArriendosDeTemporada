//@ts-nocheck
import { Factura } from "./factura";
export class Usuario {
    id: number;
    uid: string;
    email: string;
    rol: string;
    nombreUsuario: string;
    fechaRegistroUsuario: Date;
    lastLogOn: Date;
    passwordHash: string;
    estadoLogico: boolean;
    facturas: Factura[];
}