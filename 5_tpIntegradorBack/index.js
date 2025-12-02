// Importamos e instanciamos express para usar sus metodos
import express from "express";
const app = express();

// Traemos variables de entorno para extraer el port
import environments from "./src/api/config/environments.js";
const PORT = environments.port;
 
// Se importa cors para usar sus metodos y permitir request de otras aplicaciones
import cors from "cors"; 

// Se importan los middlewares
import { loggerUrl, validateId } from "./src/api/middlewares/middlewares.js";

// Se importan las rutas de producto
import { productRoutes } from "./src/api/routes/index.js";

// Se importa la configuracion para trabajar con rutas y archivos estaticos
import { join, __dirname } from "./src/api/utils/index.js";
import connection from "./src/api/database/db.js";

// Middleware que permite la realizacion de solicitudes
app.use(cors()); 

// Middleware logger
app.use(loggerUrl)

app.use(express.json()); 

// Middleware para servir archivos estaticos: se construye una ruta relativa para servir los archivos de la carpeta /public
app.use(express.static(join(__dirname, "src", "public")));

// Configuraciones

app.set("view engine", "ejs") // Para configurar ejs como motor de plantillas

app.set("views", join(__dirname, "src", "views")); // Indicamos donde estan las vistas ejs


// Endpoints
app.get("/", (req, res) => {
  res.send("TP INTEGRADOR 132 ");
});

app.get("/index", async (req, res) => {

  try {
      const [rows] = await connection.query("SELECT * FROM productos");
      console.log(rows)
      // Devolvemos la pagina index.ejs
      res.render("index", {
        title: "Indice",
        about: "Lista de productos",
        productos: rows
      });
      
  } catch (error) {
      console.log(error);
    }
});

app.get("/consultar", (req, res) => {
  res.render("consultar", {
        title: "Consultar",
        about: "Consultar Producto por id" // Le devolvemos la pagina
  })
});

app.get("/crear", (req, res) => {
  res.render("crear", {
        title: "Crear",
        about: "Crear Producto" // Le devolvemos la pagina
    })
})

app.get("/eliminar", (req, res) => {
  res.render("eliminar", {
        title: "Eliminar",
        about: "Eliminar producto por id" // Le devolvemos la pagina
    });
})

app.get("/modificar", (req, res) => {
  res.render("modificar", {
        title: "Modificar",
        about: "Modificar producto por id" // Le devolvemos la pagina
    }); 
})

app.use("/api/productos", productRoutes)




app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});