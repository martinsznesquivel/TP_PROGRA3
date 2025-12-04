import dotenv from "dotenv"; // Importamos el modulo dotenv para cargar archivos .env y sus datos

dotenv.config(); // Cargamos las variables de entorno desde el archivo.env

// Acá se exporta la informacion del .env
export default {
    port: process.env.PORT,
    database: {
        host: process.env.DB_HOST,
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    },
    session_key: process.env.SESSION_KEY
}