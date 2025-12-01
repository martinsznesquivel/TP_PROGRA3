import SalesModels from "../models/sales.models.js";

//Traer todas las ventas
export const getAllSales = async (req,res)=>{
    try{
        const [rows] = await SalesModels.selectAllSales();
        //Devuelvo las ventas
        res.status(200).json({ payload: rows });
    }catch(error){
        res.status(500).json("Error al consultar ventas");
    }
    
}

//Traer la venta por id, el :id sirve para que no envie al get de arriba
export const getSaleById = async (req, res) => {
    try {
        let { id } = req.params;
        const [rows] = await SalesModels.selectSaleById(id);

        //valido que traiga un producto
        if (rows.length === 0) {
            //Recordar retornar para que no quede trabada 
            return res.status(404).json({ message: "No se encontró el id: " + id });
        }
        return res.status(200).json({ payload: rows[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al traer la venta" });
    }
};

//Crear una venta
export const createSale= async (req, res) => {
    try {
        const { fecha, nombre_usuario, productos } = req.body;

        if (!fecha || !nombre_usuario || !Array.isArray(productos) || productos.length === 0) {
            return res.status(400).json({
                message: "Faltan datos: fecha, nombre_usuario o productos"
            });
        }

        // Calcular total
        const precio_total = productos.reduce((tot, prod) =>
            tot + prod.precio * prod.cantidad, 0
        );

        // Insertar venta
        const [result] = await SalesModels.insertIntoVentas(
            fecha, nombre_usuario, precio_total
        );
        const venta_id = result.insertId;

        // Insertar productos asociados
        for (const p of productos) {
            await SalesModels.insertIntoVentasProductos(
                venta_id,
                p.producto_id,
                p.precio,
                p.cantidad
            );
        }

        res.status(201).json({
            message: "Venta creada correctamente",
            venta_id
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error al crear la venta"
        });
    }
};
