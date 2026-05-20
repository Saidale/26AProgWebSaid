export class cuSaveUser {
    constructor(private repository: IUserRepository) {}

    async ejecutar(objUser:User): Promise<number> {
        const user = await this.repository.buscarPorId(idUsuario);

        if(!user) {
            await this.repository.guardar(objUser)
        }
        
    }

}