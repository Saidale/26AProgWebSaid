import { Client } from "pg";

const client = new Client({
    host: "localhost",
    port: 5432,
    user: "admin",
    password: "admin123",
    database: "escuela",
});

async function main() {

    try {

        await client.connect();
      
        console.log("Conexión exitosa a PostgreSQL");

        const result = await client.query(
            "SELECT * FROM usuarios"
        );

        console.log("\nUsuarios registrados:");

        console.log(result.rows);

        //Reto uno: ingresar nuevo usuario
       await client.query( "INSERT INTO usuarios(nombre) VALUES($1)",
                ["JULION ALVARES"]
                );
                
        //Reto numero dos: buscar usuario
       const consulta = await client.query("SELECT * FROM usuarios WHERE id = $1", [1]);

        console.log(`El usuario numero uno es: ${consulta.rows[0].nombre}`);
        

        //funcion de obtener usuarios
        const usuariofunction =  await obtenerUsuarios(3)
        console.log("El usuario de la funcion es: " + usuariofunction.rows[0].nombre);


    } catch (error) {

        console.error(
            "Error al conectar:",
            error
        );

    } finally {

        await client.end();

    }

}

async function obtenerUsuarios(id: number) {
            const resultado = await client.query("SELECT * FROM usuarios WHERE id = $1", [id]);
            return resultado;
        }

main();
