/*=================================
    Controladores de producto
=================================*/

//Traemos el modelo de productos con un nombre
import ProductModel from "../models/product.models.js"
import connection from "../database/db.js";

// Get all products
export const getAllProducts = async (req, res) => {
  try {

    //la conexion devuelve dos campos, rows el resultado de la tabla y fields la informacion
    const [rows, fields] = await ProductModel.selectAllProducts();

    res.status(200).json({
      payload: rows
    });

    // console.log(rows);
  } catch (error) {
    console.error("Error obteniendo productos", error.message);

    res.status(500).json({
      message: "Error interno al obtener productos",
    });
  }
}

// Get product by id
export const getProductById = async (req, res) => {
  try {

    //extraemos el valor id de la url, de toda la req solo usamos el id
    let { id } = req.params;

    const [rows] = await ProductModel.selectProductsById(id);

    // Comprobamos que exista un producto con ese id
    if (rows.length === 0) {
      console.log(`Error, no existe producto con el id ${id}`);

      return res.status(404).json({
        message: `No se encontró producto con id ${id}`,
      });
    }

    res.status(200).json({
      payload: rows,
    });
  } catch (error) {
    console.log("error obteniendo el producto por id");
    console.log(error);

    res.status(500).json({
      message: "error interno del servidor",
      error: error.message,
    });
  }
}

// POST -> Crear nuevo producto

export const createProduct = async (req, res) => {
  try {
    let { imagen, nombre, precio, categoria } = req.body;

    if (!imagen || !nombre || !precio || !categoria) {
      return res.status(400).json({
        message: "Datos invalidos, asegurate de completar todos los campos",
      });
    }


    let [rows] = await ProductModel.insertProduct(imagen, nombre, precio, categoria);

    res.status(201).json({
      message: "Producto creado con exito",
      productId: rows.insertId,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error interno del servidor",
      error: error.message,
    });
  }
}

// PUT -> Actualizar producto
export const modifyProduct = async (req, res) => {
  try {
    let { id, nombre, categoria, imagen, activo, precio } = req.body;

    if (!id || !nombre || !categoria || !imagen || !activo || !precio) {
      return res.status(400).json({
        message: "Faltan campos requeridos",
      });
    }

    let sql = `
            UPDATE productos 
            SET nombre = ?, categoria = ?, imagen = ?, activo = ?, precio = ?
            WHERE id = ?
        `;

    let [result] = await ProductModel.updateProducts(nombre, categoria, imagen, activo, precio, id);

    console.log(result);

    if (result.affectedRows === 0) {
      return res.status(400).json({
        message: "No se actualizó el producto",
      });
    }

    res.status(200).json({
      message: "Producto actualizado correctamente",
    });
  } catch (error) {
    console.log("Error al actualizar producto:", error);
    res.status(500).json({
      message: `Error intenro del servidor: ${error}`,
    });
  }
}

// DELETE -> Eliminar producto por id
export const removeProduct = async (req, res) => {
  try {
        let { id } = req.params;

        let [result] = await ProductModel.deleteProducts(id);

        if (result.affectedRows === 0) {
        return res.status(400).json({
            message: `No se eliminó el producto con id ${id}`,
        });
        }

        res.status(200).json({
        message: `Producto con id ${id} eliminado correctamente`,
        });

  } catch (error) {
        console.error("Error al eliminar un producto por su id:", error);

        res.status(500).json({
        message: `Error al eliminar producto con id: ${req.params.id}`,
        error: error.message,
    });
  }
}