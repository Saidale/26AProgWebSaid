export interface usuarioProps {
    idUsuario: string,
    nombre: string
}


export class Usuario {
    constructor(private props: usuarioProps){

    }

    getNombre ():string {
        return this.props.nombre;
    }

    getId ():string {
        return this.props.idUsuario;
    }

}

