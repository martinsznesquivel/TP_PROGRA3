/*Carrito compra */
let nombreUsuario = sessionStorage.getItem("nombreUsuario");
if (!nombreUsuario) {
    window.location.href = "bienvenida.html";
    localStorage.setItem("carrito", JSON.stringify([]));
}

// Devuelvo el carrito del local storage en array sino hay nada creo uno vacio
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const contenedorCarrito = document.getElementById("contenedorCarrito");

//mostrar carrito
function mostrarCarrito() {
    contenedorCarrito.innerHTML = "";

    //sino tengo productos
    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = `
            <p class="carrito-vacio">🛒 Tu carrito está vacío.</p>
        `;
        return;
    }

    //cuando tengo productos
    carrito.forEach((prod, index) => {
        contenedorCarrito.innerHTML += `
            <div class="item-carrito">
                <img src="${prod.imagen}" alt="${prod.nombre}">
                <div class="info-carrito">
                    <h3>${prod.nombre}</h3>
                    <p>Categoría: ${prod.categoria}</p>
                    <p>Precio: <strong>$${prod.precio}</strong></p>
                    <div class="controles-cantidad">
                        <button class="btn-cantidad" onclick="cambiarCantidad(${index}, -1)"> ➖ </button>
                        <span class="cantidad-display">${prod.cantidad || 1}</span>
                        <button class="btn-cantidad" onclick="cambiarCantidad(${index}, 1)"> ➕ </button>
                </div>
                <p>Subtotal: <strong>$${prod.precio * prod.cantidad}</strong></p>
                </div>
                <button class="btn-eliminar" onclick="eliminarProducto(${index})">❌</button>
            </div>
        `;
    });

    contenedorCarrito.innerHTML += `
        <div class="total-carrito">
            <h2>Total: $${calcularTotal()}</h2>
            <button id="vaciarCarrito" class="btn-vaciar">Vaciar carrito</button>
            <button id="comprar" class="btn-comprar">Comprar</button>
        </div>
    `;

    document.getElementById("vaciarCarrito").addEventListener("click", vaciarCarrito);
    document.getElementById("comprar").addEventListener("click", finalizarCompra);
}

// Cambiar cantidad de un producto en el carrito
function cambiarCantidad(indice, cambio) {
    if (indice < 0 || indice >= carrito.length) return;
    
    const nuevaCantidad = carrito[indice].cantidad + cambio;
    
    if (nuevaCantidad <= 0) {
        // Si llega a 0 se elimina el producto
        eliminarProducto(indice);
        return;
    }
    
    if (nuevaCantidad > 99) {
        alert("Máximo 99 unidades por producto");
        return;
    }
    
    carrito[indice].cantidad = nuevaCantidad;
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
}

// Eliminar producto
function eliminarProducto(index) {
    // Eliminar una sola cantidad cada vez que se toca el boton
        carrito.splice(index, 1)
    


    //modico el carro del local
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
}

// Vaciar carrito
function vaciarCarrito() {
    let confirmar = confirm("¿Seguro que querés vaciar el carrito?")
    if (confirmar) {
        carrito = [];
        localStorage.setItem("carrito", JSON.stringify([]));
        mostrarCarrito();
    }
}

function calcularTotal() {
    return carrito.reduce((total, prod) => total + (prod.precio * prod.cantidad), 0);
}

function crearObjetoVenta(carrito, nombre_usuario) {
    const productosAgrupados = {};

    carrito.forEach(prod => {
        if (!productosAgrupados[prod.id]) {
            productosAgrupados[prod.id] = {
                producto_id: prod.id,
                nombre: prod.nombre,
                precio: prod.precio,
                cantidad: prod.cantidad || 1
            };
        } else {
            productosAgrupados[prod.id].cantidad += prod.cantidad || 1;
        }
    });

    const productos = Object.values(productosAgrupados);
    const fecha = new Date().toLocaleString("sv-SE", { hour12: false }).replace("T","");

    return { fecha, nombre_usuario, productos };
}


//Ticket
function generarTicketPDF(venta) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    let y = 15;
    const anchoPagina = pdf.internal.pageSize.getWidth();

    // NOMBRE DE LA APP
    pdf.setFontSize(24);
    pdf.setFont("helvetica", "bold");
    pdf.text("MUSICAL-SHOP", anchoPagina / 2, y, { align: "center" });
    y += 12;

    // TÍTULO
    pdf.setFontSize(20);
    pdf.text("TICKET DE COMPRA", anchoPagina / 2, y, { align: "center" });
    y += 15;

    //FECHA
    pdf.setFontSize(12);
    pdf.text(`Fecha: ${venta.fecha}`, 15, y);
    y += 7;

    //USUARIO
    pdf.text(`Usuario: ${venta.nombre_usuario}`, 15, y);
    y += 12;

    //PRODUCTOS
    pdf.setFontSize(15);
    pdf.text("Productos:", 15, y);
    y += 10;

    pdf.setFontSize(12);

    // Encabezados de columna
    pdf.text("Producto", 15, y);
    pdf.text("Cant.", 100, y);
    pdf.text("Precio", 120, y);
    pdf.text("Subtotal", 150, y);
    y += 7;

    let total = 0;

    venta.productos.forEach(prod => {
        const subtotal = prod.precio * prod.cantidad;
        total += subtotal;

        // Detalle en línea
        pdf.text(prod.nombre, 15, y);      // nombre
        pdf.text(String(prod.cantidad), 100, y); // cantidad
        pdf.text(`$${prod.precio}`, 120, y);    // precio unitario
        pdf.text(`$${subtotal}`, 150, y);       // subtotal
        y += 7;
    });

    //TOTAL 
    y += 5;
    pdf.setFontSize(16);
    pdf.text(`TOTAL: $${total}`, 15, y);
    
    //PIE DE PAGINA
    y += 15;
    pdf.setFontSize(13);
    pdf.text("¡GRACIAS POR SU COMPRA!", anchoPagina / 2, y, { align: "center" });
    y += 5;
    pdf.text("Musical-Shop © 2025", anchoPagina / 2, y, { align: "center" });

    //GUARDAR
    pdf.save(`ticket_${venta.nombre_usuario}.pdf`);
}




async function finalizarCompra() {
    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    const confirmar = confirm("¿Estás seguro de que quieres realizar la compra?");

    if(!confirmar){
        return;
    }

    const nombre_usuario = sessionStorage.getItem("nombreUsuario");

    const venta = crearObjetoVenta(carrito, nombre_usuario);

    try {
        const response = await fetch("http://localhost:3000/api/ventas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(venta)
        });

        const data = await response.json();

        if (!response.ok) {
            alert("Error al registrar la venta: " + data.message);
            return;
        }

        alert("Compra realizada con éxito");
        generarTicketPDF(venta);

        carrito = [];
        localStorage.setItem("carrito", JSON.stringify([]));
        mostrarCarrito();
    } catch (error) {
        console.error(error);
        alert("Error al conectar con el servidor.");
    }
}

// Funcion para cerrar sesion / salir

function salirSistema() {
    const confirmar = confirm("¿Estás seguro de salir de la sesion? Se perderá todo tu carrito");

    if (confirmar){
        //Limpiamos sessionStorage (el usuario)
        sessionStorage.removeItem("nombreUsuario");
        // Limpiamos localStorage (el carrito)
        localStorage.removeItem("carrito");
        // Redirigimos al inicio
        window.location.href = "bienvenida.html";
    }
}

// Función para acceder al panel de administración
function irAlPanelAdmin() {
    // Redirige al login del backend
    window.location.href = "http://localhost:3000/login";
}

// Hacer la función global para que funcione desde onclick
window.cambiarCantidad = cambiarCantidad;
// Le agregamos event listener al boton de salir
document.getElementById("btnSalir").addEventListener("click", salirSistema);
document.getElementById("btnAdmin").addEventListener("click", irAlPanelAdmin);

// Se inicializa el carrito
mostrarCarrito();