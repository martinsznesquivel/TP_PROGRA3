import connection from "../database/db.js";
//Traer todas las ventas
const selectAllSales = ()=>{
    let sql = "SELECT * FROM ventas"
    return connection.query(sql);
}
//Traer una venta 
const selectSaleById = (id)=>{
    let sql = "SELECT * FROM ventas WHERE id = ?";
    return connection.query(sql, [id]);
}
//Crear una venta
const insertIntoVentas = (fecha, nombre_usuario, precio_total) => {
    const sqlinsertar = `
        INSERT INTO ventas (fecha, nombre_usuario, precio_total) VALUES (?, ?, ?)`;
    return connection.query(sqlinsertar, [fecha, nombre_usuario, precio_total]);
}
const insertIntoVentasProductos = (venta_id, producto_id, precio_unitario, cantidad) => {
    const sql = `
        INSERT INTO ventas_productos (venta_id, producto_id, precio_unitario, cantidad)
        VALUES (?, ?, ?, ?)
    `;
    return connection.query(sql, [venta_id, producto_id, precio_unitario, cantidad]);
}

export default{
    selectAllSales,
    selectSaleById,
    insertIntoVentas,
    insertIntoVentasProductos
}