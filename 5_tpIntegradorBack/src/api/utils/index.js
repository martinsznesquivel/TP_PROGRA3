//Logica para trabajar con archivos y rutas de proyecto

import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Se convierte las rutas file de la carpeta /public en rutas normales
const __filename = fileURLToPath(import.meta.url);

// Para obtener el directorio del archivo actual
const __dirname = join(dirname(__filename), "../../../"); // apuntamos a la carpeta raiz del proyecto

export {
    __dirname,
    join
}
