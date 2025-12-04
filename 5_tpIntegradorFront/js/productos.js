let nombreUsuario = sessionStorage.getItem("nombreUsuario");
if(!nombreUsuario){
    window.location.href = "bienvenida.html";
}

// Variables
let productos = [];
let productosFiltrados = [];
const conenedoProductos = document.getElementById("listaProductos");
const barraBusqueda = document.getElementById("barraBusqueda");

// Carrito: se guarda en localStorage
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Traer productos del backend
async function cargarProductos() {
    try {
        const response = await fetch("http://localhost:3000/api/productos");
        if (!response.ok){
            return [];
        } 
        const data = await response.json();

        productos = data.payload.filter(p => p.activo);
        productosFiltrados = [...productos];
        return productos;
    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
}

// Mostrar productos
function mostrarProductos(lista) {
    conenedoProductos.innerHTML = "";
    lista.forEach(prod => {
        conenedoProductos.innerHTML += `
            <div class="producto-card">
                <img src="${prod.imagen}" alt="${prod.nombre}">
                <h3>${prod.nombre}</h3>
                <p>Tipo: ${prod.categoria}</p>
                <p><strong>Precio:</strong> $${prod.precio}</p>
                <button onclick="agregarAlCarrito(${prod.id})">Agregar al carrito</button>
            </div>
        `;
    });
}

//filtro para barra de busqueda
function filtrarProductos() {
    const valorBusqueda = barraBusqueda.value.trim().toLowerCase();
    productosFiltrados = productos.filter(p => p.nombre.toLowerCase().startsWith(valorBusqueda));
    mostrarProductos(productosFiltrados);
}

function ordenarPorNombre() {
    const copia = [...productosFiltrados].sort((a, b) => a.nombre.localeCompare(b.nombre));
    mostrarProductos(copia);
    productosFiltrados = copia;
}
function ordenarPorPrecio() {
    const copia = [...productosFiltrados].sort((a, b) => a.precio - b.precio);
    mostrarProductos(copia);
    productosFiltrados = copia;
}

// Agregar productos al carrito
function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    const productosEnCarrito = carrito.find(p => p.id === id);
    
    if (productosEnCarrito){
        // Si ya existe un producto en el carrito, aumenta la cantidad en 1
        productosEnCarrito.cantidad += 1;
    } else {
        carrito.push({
            ...producto, // Acá copiamos todas las propiedades de ese producto
            cantidad: 1 // Acá agregamos la propiedad de cantidad (no está en el back, la maneja el front)
        });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert(`Producto "${producto.nombre}" agregado al carrito!`);
}

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

// Inicializar
async function init() {
    await cargarProductos();
    mostrarProductos(productosFiltrados);

    barraBusqueda.addEventListener("input", filtrarProductos);
    document.getElementById("ordenNombre").addEventListener("click", ordenarPorNombre);
    document.getElementById("ordenPrecio").addEventListener("click", ordenarPorPrecio);
    document.getElementById("btnSalir").addEventListener("click", salirSistema);
}

init();