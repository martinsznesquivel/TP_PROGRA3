/* =========================
    Modelos de producto
========================= */

import connection from "../database/db.js";

// Traer todos los productos

const selectAllProducts = () => {
     const sql = "SELECT * FROM productos";

    //la conexion devuelve dos campos, rows el resultado de la tabla y fields la informacion
    return connection.query(sql);
}

// Traer productos por id

const selectProductsById = (id) => {
    
    let sql = "SELECT * FROM productos WHERE productos.id = ? LIMIT 1";

    return connection.query(sql, [id]);
}

// Crear productos

const insertProduct = (imagen, nombre, precio, categoria) => {
    
    let sql = `INSERT INTO productos (imagen, nombre, precio, categoria) VALUES (?, ?, ?, ?)`;

    return connection.query(sql, [imagen, nombre, precio, categoria]);
    
}

// Modificar productos

const updateProducts = (nombre, categoria, imagen, activo, precio, id) => {

    let sql = `
        UPDATE productos 
        SET nombre = ?, categoria = ?, imagen = ?, activo = ?, precio = ?
        WHERE id = ?
    `;

    return connection.query(sql, [nombre, categoria, imagen, activo, precio, id,]);
}

// ELiminar productos

const deleteProducts = (id) => {
        let sql = `DELETE FROM productos WHERE id = ?`;

        let sql2 = `UPDATE products set active = 0 WHERE id = ?`;

        return connection.query(sql, [id]);
}






export default {
    selectAllProducts,
    selectProductsById,
    insertProduct,
    updateProducts,
    deleteProducts
}