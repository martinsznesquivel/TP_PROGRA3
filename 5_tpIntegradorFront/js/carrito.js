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
                </div>
                <button class="btn-eliminar" onclick="eliminarProducto(${index})">
                    ❌
                </button>
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

// Eliminar producto
function eliminarProducto(index) {
    //splice funcionaba de la manera que daba el index e indicaba cuantos queria eliminar de esa pos
    carrito.splice(index, 1);
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
    return carrito.reduce((total, prod) => total + prod.precio, 0);
}

async function finalizarCompra() {
    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    const nombre_usuario = sessionStorage.getItem("nombreUsuario");

    //Agrupo los tipos que tienen el mismo id asi cuando lo cargo a ventas_productos me muestra 
    const productosAgrupados = {};

    carrito.forEach(prod => {
        if (!productosAgrupados[prod.id]) {
            productosAgrupados[prod.id] = {
                producto_id: prod.id,
                precio: prod.precio,
                cantidad: 1
            };
        } else {
            productosAgrupados[prod.id].cantidad++;
        }
    });

    const productosAEnviar = Object.values(productosAgrupados);

    //Fecha
    const fecha = new Date().toISOString().slice(0, 19).replace("T", " ");
    //genero el objeto que va en la tabla venta
    const venta = {
        fecha,
        nombre_usuario,
        productos: productosAEnviar
    };
    //Hago un post a /api/ventas
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

        alert("Compra realizada con éxito ");
        
        //ACA DEBERIA IR LA IMPLEMENTACION DE CREAR FACTURA
        // Vaciar carrito
        carrito = [];
        localStorage.setItem("carrito", JSON.stringify([]));
        mostrarCarrito();

    } catch (error) {
        console.error(error);
        alert("Error al conectar con el servidor.");
    }
}
// Inicializar
mostrarCarrito();