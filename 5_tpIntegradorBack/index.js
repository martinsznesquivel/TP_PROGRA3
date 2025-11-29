import express from "express";
const app = express();

import cors from "cors"; // Importamos cors para poder usar sus metodos y permitir solicitudes de otras aplicaciones hacia nuestra api
app.use(cors()); // Middleware basico que permite todas las solicitudes

app.use(express.json()); 

import environments from "./src/api/config/environments.js";
const PORT = environments.port;

import connection from "./src/api/database/db.js";

// Endpoints
app.get("/", (req, res) => {
  res.send("Hola mundo desde Express.js");
});


// Traer los productos

app.get("/api/productos", async (req, res) => {
  try {
    const sql = "SELECT * FROM productos";

    //la conexion devuelve dos campos, rows el resultado de la tabla y fields la informacion
    const [rows, fields] = await connection.query(sql);

    res.status(200).json({
      payload: rows,
    });

    // console.log(rows);
  } catch (error) {
    console.error("Error obteniendo productos", error.message);

    res.status(500).json({
      message: "Error interno al obtener productos",
    });
  }
});

//Consultar por id Get product by id
app.get("/api/productos/:id", async (req,res)=>{
    try{
        //extraemos el valor id de la url, de toda la req solo usamos el id
        let {id} = req.params;
        let sql  = "SELECT * FROM productos WHERE productos.id = ?";
        const [rows] = await  connection.query(sql,[id]);
        res.status(200).json({
            payload:rows
        });
    }
    catch(error){
        console.log("error obteniendo el producto por id");
        console.log(error);

        res.status(500).json({
            message:"error interno del servidor",
            error:error.message
        })
    }
})


//Eliminar producto por id
app.delete("/api/productos/:id", async (req, res) => {
    try {
        let { id } = req.params;

        let sql = `DELETE FROM productos WHERE id = ?`;
        await connection.query(sql, [id]);

        res.status(200).json({
            message: `Producto con id ${id} eliminado correctamente`
        });

    } catch (error) {
        console.error("Error al eliminar un producto por su id:", error);
        res.status(500).json({
            message: `Error al eliminar producto con id: ${req.params.id}`,
            error: error.message
        });
    }
});


// Crear nuevos productos

app.post("/api/productos", async (req, res) => {
  try {
    let { imagen, nombre, precio, categoria } = req.body;

    if (!imagen || !nombre || !precio || !categoria) {
      return res.status(400).json({
        message: "Datos invalidos, asegurate de completar todos los campos",
      });
    }

    let sql = `INSERT INTO productos (imagen, nombre, precio, categoria) VALUES (?, ?, ?, ?)`;

    let [result] = await connection.query(sql, [
      imagen,
      nombre,
      precio,
      categoria,
    ]);

    res.status(201).json({
      message: "Producto creado con exito",
      productId: result.insertId,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error interno del servidor",
      error: error.message,
    });
  }
});
