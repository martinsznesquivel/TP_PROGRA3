import { Router } from "express";
import { validateId } from "../middlewares/middlewares.js";

import {
    getAllSales,
    getSaleById,
    createSale
} from "../controllers/sales.controllers.js";

const router = Router();

// Obtener todas las ventas
router.get("/", getAllSales);

// Obtener una venta por id
router.get("/:id", validateId, getSaleById);

// Crear una venta
router.post("/", createSale);

export default router;