// Importamos e instanciamos el middleware Router
import { Router } from "express";
const router = Router();

// Importamos el middleware validateId
import { validateId } from "../middlewares/middlewares.js";

// Traemos la conexion a la BBDD
import { createProduct, getAllProducts, getProductById, modifyProduct, removeProduct } from "../controllers/product.controllers.js";
import { multerUploader } from "../middlewares/multer_middleware.js";

// Traer los productos
router.get("/", getAllProducts);

//Consultar por id Get product by id
router.get("/:id", validateId, getProductById);

//put actualizar productos
router.put("/", modifyProduct);

//Eliminar producto por id
router.delete("/:id", validateId, removeProduct);

// Crear nuevos productos
router.post("/", createProduct);

// Subir imagenes
router.post("/upload", multerUploader.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No se subió ningún archivo" });
    }
    
    res.status(200).json({
        message: "Imagen subida correctamente",
        payload: {
            url: req.file.filename,
            originalName: req.file.originalname
        }
    });
});
export default router