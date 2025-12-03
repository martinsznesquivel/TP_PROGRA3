// Importamos e instanciamos express para usar sus metodos
import express from "express";
const app = express();

// Traemos variables de entorno para extraer el port
import environments from "./src/api/config/environments.js";
const PORT = environments.port;
 
// Se importa cors para usar sus metodos y permitir request de otras aplicaciones
import cors from "cors"; 

// Se importan los middlewares
import { loggerUrl, requireLogin } from "./src/api/middlewares/middlewares.js";

// Se importan las rutas de producto
import { productRoutes, salesRoutes } from "./src/api/routes/index.js";

// Se importa la configuracion para trabajar con rutas y archivos estaticos
import { join, __dirname } from "./src/api/utils/index.js";
import connection from "./src/api/database/db.js";

import session from "express-session";
import { render } from "ejs";
import nodemon from "nodemon";
const SESSION_KEY = environments.session_key;

import { handleMulterError } from "./src/api/middlewares/multer_middleware.js";
import { comparePassword, hashPassword } from "./src/api/utils/bcrypt.js";

// Middleware que permite la realizacion de solicitudes
app.use(cors()); 

// Middleware logger
app.use(loggerUrl)

app.use(handleMulterError)

app.use(express.json()); 

// Middleware para parsear la info de <form>
app.use(express.urlencoded( {extended: true})); // Para leer la info que nos envian por POST los <form> de HTML sin fetch ni JSON

// Middleware para servir archivos estaticos: se construye una ruta relativa para servir los archivos de la carpeta /public
app.use(express.static(join(__dirname, "src", "public")));

/*======================
    Sesiones en express
========================
Express sesion es un middleware que permite que Express recuerde datos entre peticiones
Como HTTP es sin estado, Express no sabe quienes somos entre una ruta y otra, por lo que al iniciar sesion necesitamos guardar algo asi =
req.session.user = {id: 12, name: "Javier"}

En cualquier request futura 
if(!req.session.user) {
    return res.redirect("/login");
    }

Sin sesiones no hay forma de saber si el usuario está logueado a menos que usemos tokens JWT, cookies firmadas o algun otro sistema
*/

// Middleware de sesion, cada vez que un usuario hace una solicitud HTTP, se gestionará su sesion mediante el middleware
app.use(session({
  secret: SESSION_KEY, // Firma las cookies para evitar manipulacion por el cliente para la seguridad de la aplicacion
  resave: false, // Evita guardar la sesion si no hubo cambios
  saveUninitialized: true // No guarda sesiones vacias
}));

/*=======================
      Configuracion
=======================*/



app.set("view engine", "ejs") // Para configurar ejs como motor de plantillas

app.set("views", join(__dirname, "src", "views")); // Indicamos donde estan las vistas ejs

// Devolvemos vistas
app.get("/", requireLogin, async (req, res) => {

  try {
      const [rows] = await connection.query("SELECT * FROM productos");

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

// Consultar productos por ID
app.get("/consultar", requireLogin ,(req, res) => {

  res.render("consultar", {
        title: "Consultar",
        about: "Consultar Producto por id" // Le devolvemos la pagina
  })
});

// Crear productos
app.get("/crear", requireLogin, (req, res) => {

  res.render("crear", {
        title: "Crear",
        about: "Crear Producto" // Le devolvemos la pagina
    })
})

// Eliminar productos por ID
app.get("/eliminar", requireLogin, (req, res) => {

  res.render("eliminar", {
        title: "Eliminar",
        about: "Eliminar producto por id" // Le devolvemos la pagina
    });
})

// Modificar productos por ID
app.get("/modificar", requireLogin, (req, res) => {
  
  res.render("modificar", {
        title: "Modificar",
        about: "Modificar producto por id" // Le devolvemos la pagina
    }); 
})

// Subir imagenes
app.get("/subirImagen", requireLogin, (req, res) => {
  
  res.render("subirImagen", {
        title: "subirImagen",
        about: "Subi tu imagen" // Le devolvemos la pagina
    }); 
})


// Vista de login
app.get("/login", (req, res) => {
  res.render("login", {
    title: "Login",
    about: "Login para dashboard"
  });
})

// Endpoint para iniciar sesion
/*
app.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.render("login", {
          title : "Login",
          about : "Login dashboard",
          error : "Todos los campos son obligatorios"
        });
      }

      const sql = "SELECT * FROM usuario WHERE email = ? AND password = ?";
      const [rows] = await connection.query(sql, [email, password]);
      
      if(rows.length === 0) {
        return res.render("login", {
          title : "Login",
          about : "Login dashboard",
          error : "Credenciales incorrectas"
        })
      }

      const user = rows[0];
      console.table(user);

      // Con el mail y contraseñas validados, guardamos la sesion
      req.session.user = {
        id: user.id,
        nombre: user.nombre,
        email: user.email
      }

      res.redirect("/") // Redirigimos a la pagina principal

    } catch (error) {
      console.error("Error en el login ", error)
    }
})
    */

// Login con contraseña hasheada
app.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(await hashPassword(password));

      if (!email || !password) {
        return res.render("login", {
          title : "Login",
          about : "Login dashboard",
          error : "Todos los campos son obligatorios"
        });
      }

      const sql = "SELECT * FROM usuario WHERE email = ?";
      const [rows] = await connection.query(sql, [email]);
      
      if(rows.length === 0) {
        return res.render("login", {
          title : "Login",
          about : "Login dashboard",
          error : "Credenciales incorrectas"
        })
      }

      const user = rows[0];
      const isMatch = await comparePassword(password, user.password)
      if(!isMatch){
        return res.render("login", {
          title : "Login",
          about : "Login dashboard",
          error : "Credenciales incorrectas"
        })
      }

      console.table(user);

      // Con el mail y contraseñas validados, guardamos la sesion
      req.session.user = {
        id: user.id,
        nombre: user.nombre,
        email: user.email
      }

      res.redirect("/") // Redirigimos a la pagina principal

    } catch (error) {
      console.error("Error en el login ", error)
    }
})

app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.log("Error al destruir la sesion", err)
        return res.status(500).json({
          error : "Error al cerrar la sesion"
        });
      }

      res.redirect("/login")
    })
})

app.use("/api/productos", productRoutes)

app.use("/api/ventas",salesRoutes);



app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});