//@ts-nocheck
import { DepartamentoDTO } from "./_dto/departamento.dto";
export class Utilidad {
    id: number;
    nombre: string;
    descripcion: string;
    valor: number;
    cantidad: number;
    estado: string;
    departamento: DepartamentoDTO;
}