import client from "./db.ts";
import { logRequest } from "./loggers.ts";
import { validarUsuario } from "./validaciones.ts";


interface UsuarioBody {
    nombre: string;
    email: string
}

interface profesorBody {
    nombre: string,
    especialidad: string,
    telefono_Contacto: string,
    fecha_ingreso: string
}

interface AulaBody {
    numero_aula: number;
    piso_edificio: string;
    capacidad_maxima: number;
    tipo_aula: string;
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

             //GET USUARIOS (consultar todos los usuarios)
      //Comando de ejecucion: curl -Method GET -Uri "http://localhost:3000/usuarios" | Select-Object -ExpandProperty Content
      //curl -X GET http://localhost:3000/usuarios
        if (method === 'GET' && path === '/usuarios') {
            try {
                const result = await client.query('SELECT * FROM usuarios');
                return Response.json(result.rows);
            } catch (error) {
                console.error("Error en BD:", error);
                return new Response("Error interno del servidor", { status: 500 });
            }
        }

        //GET USUARIO (consultar un usuario por su ID)
        //Comando de ejecucion: curl -Method GET -Uri "http://localhost:3000/usuarios/3" | Select-Object -ExpandProperty Content
        //Comando Linux/Vagrant: curl -X GET http://localhost:3000/usuarios/3
        if (method === 'GET' && path.startsWith('/usuarios/')) {
            try {
                const id = path.split('/')[2];
                const result = await client.query('SELECT * FROM usuarios WHERE id = $1', [id]);
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
                const { nombre, email } = body;

                if (!nombre) {
                    return new Response("El campo nombre es obligatorio", { status: 400 });
                }
                if (!email) {
                    return new Response("El campo email es obligatorio", { status: 400 });
                }

                const query = `
                    INSERT INTO usuarios (nombre, email) 
                    VALUES ($1, $2)
                    RETURNING *;
                `;

                const result = await client.query(query, [nombre, email]);
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
                const { nombre, email } = body;        

                if (!nombre) {
                    return new Response("El campo nombre es obligatorio", { status: 400 });
                }
                if (!email) {
                    return new Response("El campo email es obligatorio", { status: 400 });
                }

                const query = `
                    UPDATE usuarios 
                    SET nombre = $1, email = $2
                    WHERE id = $3 
                    RETURNING *;
                `;
                
                const result = await client.query(query, [nombre, email, id]);

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

        
        
        //--------------TABLA DE PROFESORES------------------
        //CONSULTAR PROFESORES
        if(method === 'GET' && path === '/profesor'){
            try {
                const profe = await client.query('SELECT * FROM profesor')
                return Response.json(profe.rows)
            }

            catch (error) {
                console.error("Error en BD:", error);
                return new Response("Error interno del servidor", { status: 500 });
            }
        }

        //CONSULTAR PROFESOR POR ID
        if(method === 'GET' && path.startsWith('/profesor/')) {

            try {
                const id = path.split('/')[2]
                const profesor = await client.query('SELECT * FROM profesor WHERE id = $1', [id])
                return Response.json(profesor.rows)
            }

            catch(error) {
                console.error("Error en BD:", error);
                return new Response("Error interno del servidor", { status: 500 });
            }
        }

        //ELIMINAR NUEVO PROFESOR POR ID
        if (method === "DELETE" && path.startsWith("/profesor/")) {
            try {
                const id = path.split('/')[2];
                await client.query("DELETE FROM profesor WHERE id = $1", [id]);
                return new Response('profesor eliminado');
            } catch (error) {
                console.error("Error en BD:", error);
                return new Response("Error interno del servidor", { status: 500 });
            }
        }

        //INGRESAR NUEVO PROFESOR
         if (method === "POST" && path === "/profesor") {
            try {
                const profesor = await req.json() as profesorBody;
                const { nombre, especialidad, telefono_Contacto, fecha_ingreso } = profesor;

                if (!nombre) {
                    return new Response("El campo nombre es obligatorio", { status: 400 });
                }
                if (!especialidad) {
                    return new Response("El campo especialidad es obligatorio", { status: 400 });
                }
                if (!telefono_Contacto) {
                    return new Response("El campo telefono es obligatorio", { status: 400 });
                }
                if (!fecha_ingreso) {
                    return new Response("El campo fecha es obligatorio", { status: 400 });
                }

                const query = `
                    INSERT INTO profesor (nombre, especialidad, telefono_contacto, fecha_ingreso) 
                    VALUES 
                    ($1, $2, $3, $4)
                    RETURNING *;
                `;

                const result = await client.query(query, [nombre, especialidad, telefono_Contacto, fecha_ingreso]);

                return Response.json(result.rows[0], { status: 201 });

            } catch (error) {
                console.error("Error en BD al insertar:", error);
                return new Response("Error interno del servidor", { status: 500 });
            }
        }
        //EDITAR PROFESOR
        if (method === "PUT" && path.startsWith("/profesor/")) {
            try {
                const id = path.split("/")[2]; 

                if (!id) {
                    return new Response("ID de profesor no proporcionado", { status: 400 });
                }

                const profesor = await req.json() as profesorBody;
                const { nombre, especialidad, telefono_Contacto, fecha_ingreso } = profesor;        

                if (!nombre) {
                    return new Response("El campo nombre es obligatorio", { status: 400 });
                }
                if (!especialidad) {
                    return new Response("El campo especialidad es obligatorio", { status: 400 });
                }
                if (!telefono_Contacto) {
                    return new Response("El campo telefono es obligatorio", { status: 400 });
                }
                if (!fecha_ingreso) {
                    return new Response("El campo fecha es obligatorio", { status: 400 });
                }

                const query = `
                    UPDATE profesor 
                    SET nombre = $1, especialidad = $2, telefono_contacto = $3, fecha_ingreso = $4
                    WHERE id = $5 
                    RETURNING *;
                `;
                
                const result = await client.query(query, [nombre, especialidad, telefono_Contacto, fecha_ingreso, id]);

                if (result.rowCount === 0) {
                    return new Response("Profesor no encontrado", { status: 404 });
                }

                return Response.json(result.rows[0]);

            } catch (error) {
                console.error("Error en BD al actualizar profesor:", error);
                return new Response("Error interno del servidor", { status: 500 });
            }
        }


        //------------------AULAS-----------------------------
        if (method === 'GET' && path === '/aula') {
            try {
                const result = await client.query('SELECT * FROM aula');
                return Response.json(result.rows);
            } catch (error) {
                console.error("Error en BD:", error);
                return new Response("Error interno del servidor", { status: 500 });
            }
        }

        if (method === 'GET' && path.startsWith('/aula/')) {
            try {
                const id = path.split('/')[2];
                const result = await client.query('SELECT * FROM aula WHERE id = $1', [id]);
                return Response.json(result.rows);
            } catch (error) {
                console.error("Error en BD:", error);
                return new Response("Error interno del servidor", { status: 500 });
            }
        }

        if (method === "DELETE" && path.startsWith("/aula/")) {
            try {
                const id = path.split('/')[2];
                await client.query("DELETE FROM aula WHERE id = $1", [id]);
                return new Response('aula eliminada');
            } catch (error) {
                console.error("Error en BD:", error);
                return new Response("Error interno del servidor", { status: 500 });
            }
        }

         if (method === "POST" && path === "/aula") {
            try {
                const body = await req.json() as AulaBody;
                const { numero_aula, piso_edificio, capacidad_maxima, tipo_aula } = body;

                if (!numero_aula) {
                    return new Response("El campo numero_aula es obligatorio", { status: 400 });
                }
                if (!piso_edificio) {
                    return new Response("El campo piso_edificio es obligatorio", { status: 400 });
                }
                if (!capacidad_maxima) {
                    return new Response("El campo capacidad_maxima es obligatorio", { status: 400 });
                }
                if (!tipo_aula) {
                    return new Response("El campo tipo_aula es obligatorio", { status: 400 });
                }

                const query = `
                    INSERT INTO aula (numero_aula, piso_edificio, capacidad_maxima, tipo_aula) 
                    VALUES ($1, $2, $3, $4)
                    RETURNING *;
                `;

                const result = await client.query(query, [numero_aula, piso_edificio, capacidad_maxima, tipo_aula]);
                return Response.json(result.rows[0], { status: 201 });

            } catch (error) {
                console.error("Error en BD al insertar:", error);
                return new Response("Error interno del servidor", { status: 500 });
            }
        }

        if (method === "PUT" && path.startsWith("/aula/")) {
            try {
                const id = path.split("/")[2]; 

                if (!id) {
                    return new Response("ID de aula no proporcionado", { status: 400 });
                }

                const body = await req.json() as AulaBody;
                const { numero_aula, piso_edificio, capacidad_maxima, tipo_aula } = body;        

                if (!numero_aula) {
                    return new Response("El campo numero_aula es obligatorio", { status: 400 });
                }
                if (!piso_edificio) {
                    return new Response("El campo piso_edificio es obligatorio", { status: 400 });
                }
                if (!capacidad_maxima) {
                    return new Response("El campo capacidad_maxima es obligatorio", { status: 400 });
                }
                if (!tipo_aula) {
                    return new Response("El campo tipo_aula es obligatorio", { status: 400 });
                }

                const query = `
                    UPDATE aula 
                    SET numero_aula = $1, piso_edificio = $2, capacidad_maxima = $3, tipo_aula = $4
                    WHERE id = $5 
                    RETURNING *;
                `;
                
                const result = await client.query(query, [numero_aula, piso_edificio, capacidad_maxima, tipo_aula, id]);

                if (result.rowCount === 0) {
                    return new Response("Aula no encontrada", { status: 404 });
                }

                return Response.json(result.rows[0]);

            } catch (error) {
                console.error("Error en BD al actualizar aula:", error);
                return new Response("Error interno del servidor", { status: 500 });
            }
        }







        return new Response("Not Found", { status: 404 });
    }
});

console.log(`El servidor está corriendo en: http://127.0.0.1:${server.port}`);