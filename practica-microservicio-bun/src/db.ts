import { Client } from "pg";

const client = new Client({
    host: "host.docker.internal",
    port: 5432,
    user: "admin",
    password: "admin123",
    database: "escuela",
});

await client.connect();
console.log("Conectado a la base de datos PostgreSQL");

export default client;