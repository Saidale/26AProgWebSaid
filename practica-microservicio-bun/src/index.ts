import client from "./db.ts";
import { logRequest } from "./loggers.ts";
import { validarUsuario } from "./validaciones.ts";


interface UsuarioBody {
    nombre: string;
}

const server = Bun.serve({
    port: 3000,
    async fetch(req) {
      
        logRequest(req);

        const url = new URL(req.url);
        const method = req.method;
        const path = url.pathname;


        if(path  === '/') {
            return new Response("Bienvenido")
        }

       //GET status del servidor
       //Comando de ejecuion: curl -Method GET -Uri "http://localhost:3000/health" 
       //Comando Linux/Vagrant: curl -X GET http://localhost:3000/health
        if (method === "GET" && path === "/health") {
            return Response.json({ status: "OK", uptime: process.uptime() });
        }

      //GET USUARIOS (consultar todos los usuarios)
      //Comando de ejecucion: curl -Method GET -Uri "http://localhost:3000/usuarios" | Select-Object -ExpandProperty Content
      //curl -X GET http://localhost:3000/usuarios

        if (method === "GET" && path === "/usuarios") {
            try {
                const result = await client.query("SELECT * FROM usuarios");
                return Response.json(result.rows);
            } catch (error) {
                console.error("Error en BD:", error);
                return new Response("Error interno del servidor", { status: 500 });
            }
        }

        //GET USUARIO (consultar un usuario por su ID)
        //Comando de ejecucion: curl -Method GET -Uri "http://localhost:3000/usuarios/3" | Select-Object -ExpandProperty Content
        //Comando Linux/Vagrant: curl -X GET http://localhost:3000/usuarios/3
        if (method === "GET" && path.startsWith("/usuarios/")) {
            try {
                const id = path.split('/')[2];
                const result = await client.query("SELECT * FROM usuarios WHERE id = $1", [id]);
                return Response.json(result.rows);
            } catch (error) {
                console.error("Error en BD:", error);
                return new Response("Error interno del servidor", { status: 500 });
            }
        }

        //DELETE usuario 
        ////Comando de ejecucion: curl -Method DELETE -Uri "http://localhost:3000/usuarios/IDUSUARIO"
        //Comando Linux/Vagrant: curl -X DELETE http://localhost:3000/usuarios/3
        if (method === "DELETE" && path.startsWith("/usuarios/")) {
            try {
                const id = path.split('/')[2];
                await client.query("DELETE FROM usuarios WHERE id = $1", [id]);
                return new Response('Usuario eliminado');
            } catch (error) {
                console.error("Error en BD:", error);
                return new Response("Error interno del servidor", { status: 500 });
            }
        }

        //POST - Crear un nuevo usuario
        //Comando de ejecucion en PowerShell: curl -Method POST -Uri "http://localhost:3000/usuarios" -Headers @{"Content-Type"="application/json"} -Body '{"nombre": "chihuahua"}' | Select-Object -ExpandProperty Content
        //Comando de ejecucion en Linux/Vagrant: curl -X POST http://localhost:3000/usuarios -H "Content-Type: application/json" -d '{"nombre": "chihuahua"}'
        if (method === "POST" && path === "/usuarios") {
            try {
                const body = await req.json() as UsuarioBody;
                const { nombre } = body;

                if (!nombre) {
                    return new Response("El campo nombre es obligatorio", { status: 400 });
                }

                const query = `
                    INSERT INTO usuarios (nombre) 
                    VALUES ($1) 
                    RETURNING *;
                `;

                const result = await client.query(query, [nombre]);
                return Response.json(result.rows[0], { status: 201 });

            } catch (error) {
                console.error("Error en BD al insertar:", error);
                return new Response("Error interno del servidor", { status: 500 });
            }
        }

        

        //PUT  Actualizar un usuario 
        //Comando de ejecucion: curl -X PUT http://localhost:3000/usuarios/IDUSUARIO \  -H "Content-Type: application/json" \  -d '{"nombre": "nombre a editar"}'
       if (method === "PUT" && path.startsWith("/usuarios/")) {
            try {
                
                const id = path.split("/")[2]; 

                if (!id) {
                    return new Response("ID de usuario no proporcionado", { status: 400 });
                }

                const body = await req.json() as UsuarioBody;
                const { nombre } = body; // Solo extraemos el nombre

                if (!nombre) {
                    return new Response("El campo nombre es obligatorio", { status: 400 });
                }

                const query = `
                    UPDATE usuarios 
                    SET nombre = $1 
                    WHERE id = $2 
                    RETURNING *;
                `;
                
                const result = await client.query(query, [nombre, id]);

                // Verificar si el usuario existía
                if (result.rowCount === 0) {
                    return new Response("Usuario no encontrado", { status: 404 });
                }

                return Response.json(result.rows[0]);

            } catch (error) {
                console.error("Error en BD al actualizar:", error);
                return new Response("Error interno del servidor", { status: 500 });
            }
}

        return new Response("Not Found", { status: 404 });
    }
});

console.log(`El servidor está corriendo en: http://127.0.0.1:${server.port}`);