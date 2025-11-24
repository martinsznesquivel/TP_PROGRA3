import express from "express";
const app = express();

import cors from "cors";
app.use(cors()); // Middleware basico que permite todas las solicitudes

import environments from "./src/api/config/environments.js";
const PORT = environments.port;

import connection from "./src/api/database/db.js";


// Endpoints
app.get("/", (req, res) => {
    res.send("Hola mundo desde Express.js");
});

app.get("/productos", async (req, res) => {
    try{
        const sql = "SELECT * FROM productos";

        //la conexion devuelve dos campos, rows el resultado de la tabla y fields la informacion
        const [rows, fields] = await connection.query(sql);

        res.status(200).json({
            payload: rows
        });

       // console.log(rows);

    } catch (error) {
        console.error("Error obteniendo productos", error.message);

        res.status(500).json({
            message: "Error interno al obtener productos"
        });
        
    }
})

app.listen(PORT, () => {
    console.log(`Servidor corriendo desde el puerto ${PORT}`)
})



