// Variables
let productos = [];
let productosFiltrados = [];
const contenedorProductos = document.getElementById("listaProductos");
const barraBusqueda = document.getElementById("barraBusqueda");

// Carrito: se guarda en localStorage
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Traer productos del backend
async function cargarProductos() {
    try {
        const response = await fetch("http://localhost:3000/api/productos");
        if (!response.ok) throw new Error("Error al traer productos");

        const data = await response.json();
        productos = data.payload.filter(p => p.activo === 1 || p.activo === 0);
        productosFiltrados = [...productos];
        return productos;
    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
}

// Mostrar productos
function mostrarProductos(lista) {
    contenedorProductos.innerHTML = "";
    lista.forEach(prod => {
        contenedorProductos.innerHTML += `
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

// Filtrar productos
function filtrarProductos() {
    const valorBusqueda = barraBusqueda.value.trim().toLowerCase();
    productosFiltrados = productos.filter(p => p.nombre.toLowerCase().includes(valorBusqueda));
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

function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    carrito.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carrito));

    alert(`Producto "${producto.nombre}" agregado al carrito!`);
}

// Inicializar
async function init() {
    await cargarProductos();
    mostrarProductos(productosFiltrados);

    barraBusqueda.addEventListener("input", filtrarProductos);
    document.getElementById("ordenNombre").addEventListener("click", ordenarPorNombre);
    document.getElementById("ordenPrecio").addEventListener("click", ordenarPorPrecio);
}

init();