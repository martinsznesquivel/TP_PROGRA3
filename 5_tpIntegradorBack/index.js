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

// Middleware que permite la realizacion de solicitudes
app.use(cors()); 

// Middleware logger
app.use(loggerUrl)

app.use(express.json()); 


// Endpoints
app.get("/", (req, res) => {
  res.send("Hola mundo desde Express.js");
});

app.use("/api/productos", productRoutes)


app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});