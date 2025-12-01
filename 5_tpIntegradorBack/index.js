import express from "express";
import environments from "./src/api/config/environments.js";
import connection from "./src/api/database/db.js";
import cors from "cors"; 
import { loggerUrl, validateId } from "./src/api/middlewares/middlewares.js";
const app = express();


app.use(cors()); 

app.use(loggerUrl)

app.use(express.json()); 

const PORT = environments.port;



app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

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
app.get("/api/productos/:id", validateId, async (req,res)=>{
    try{
        //extraemos el valor id de la url, de toda la req solo usamos el id
        let {id} = req.params;

        let sql  = "SELECT * FROM productos WHERE productos.id = ? LIMIT 1";

        const [rows] = await  connection.query(sql,[id]);

        if (rows.length === 0) {
          console.log(`Error, no existe producto con el id ${id}`);
          
          return res.status(404).json({
            message : `No se encontró producto con id ${id}`
          });
        }

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

//put actualizar productos
//Primero traemos el producto y luego lo modicamos
app.put("/api/productos",async(req,res)=>{
    try{
        let {id, nombre, categoria, imagen, activo, precio} = req.body;
        let sql = `UPDATE productos 
            SET nombre = ?, categoria = ?, imagen = ?, activo = ?, precio = ?
            WHERE id = ?
        `;
        let result = await connection.query(sql,[nombre,categoria,imagen,activo,precio,id]);
        console.log(result);
        res.status(200).json({
            message:"Producto actualizado correctamente"
        });
    }catch(error){
        console.log("Error al actualizar producto:",error);
        res.status(500).json({
            message:`Error intenro del servidor: ${error}`
        })
    }
})


//Eliminar producto por id
app.delete("/api/productos/:id", validateId, async (req, res) => {
    try {
        let { id } = req.params;

        let sql = `DELETE FROM productos WHERE id = ?`;

        let sql2 = `UPDATE products set active = 0 WHERE id = ?`;
        
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
