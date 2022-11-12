//@ts-nocheck
export class UsuarioDTO {
    id: number;
    uid: string;
    email: string;
    rol: string;
    nombreUsuario: string;
    fechaRegistroUsuario: Date;
    lastLogOn: Date;
    passwordHash: string;
    estadoLogico: boolean;
}