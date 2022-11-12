//@ts-nocheck
export class DepartamentoDTO {
    idDepartamento: number;
    ubicacionDepartamento: string;
    regionDepartamento: string;
    descripcionDepartamento: string;
    valorBase: number;
    cantidadDormitorios: number;
    estado: string;
    fechaRegistroDepartamento: Date;
    fechaUltimaReserva: Date;
    fechaUltimaMantencion: Date;
    estadoLogico: boolean;
    fotografias: string[];
}