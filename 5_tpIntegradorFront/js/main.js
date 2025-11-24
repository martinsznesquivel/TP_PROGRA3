//array de productos
/*
const frutas = [
  { id: 1, nombre: "arandano", precio: 5000, ruta_img: "img/arandano.jpg" },
  { id: 2, nombre: "banana", precio: 1000, ruta_img: "img/banana.jpg" },
  { id: 3, nombre: "frambuesa", precio: 4000, ruta_img: "img/frambuesa.png" },
  { id: 4, nombre: "frutilla", precio: 3000, ruta_img: "img/frutilla.jpg" },
  { id: 5, nombre: "kiwi", precio: 2000, ruta_img: "img/kiwi.jpg" },
  { id: 6, nombre: "mandarina", precio: 800, ruta_img: "img/mandarina.jpg" },
  { id: 7, nombre: "manzana", precio: 1500, ruta_img: "img/manzana.jpg" },
  { id: 8, nombre: "naranja", precio: 9000, ruta_img: "img/naranja.jpg" },
  { id: 9, nombre: "pera", precio: 2500, ruta_img: "img/pera.jpg" },
  { id: 10, nombre: "anana", precio: 3000, ruta_img: "img/anana.jpg" },
  { id: 11, nombre: "pomelo-amarillo", precio: 2000, ruta_img: "img/pomelo-amarillo.jpg" },
  { id: 12, nombre: "pomelo-rojo", precio: 2000, ruta_img: "img/pomelo-rojo.jpg" },
  { id: 13, nombre: "sandia", precio: 3500, ruta_img: "img/sandia.jpg" }
  
];

//variables
let contenedorFrutas = document.querySelector("#contenedorFrutas");

let contenedorCarrito = document.querySelector("#contenedorCarrito");

let barraBusqueda = document.querySelector("#barraBusqueda");

let carrito = [];



function mostrarProductos(array) {
  let cartaProducto = "";
  array.forEach((fruta) => {
    cartaProducto += `
            <div class="card-producto">
                <img src="${fruta.ruta_img}" alt="${fruta.nombre}" />
                <h3>${fruta.nombre}</h3>
                <p>$ ${fruta.precio}</p>
                <button onclick="agregarACarrito(${fruta.id})">Agregar al carrito</button>
            </div> `;
  });
  contenedorFrutas.innerHTML = cartaProducto; 
}

barraBusqueda.addEventListener("keyup", () => {
    filtrarProductos();
});



function filtrarProductos(){
    let valorBusqueda = barraBusqueda.value.toLowerCase();

    console.log(valorBusqueda);

    let productosFiltrados = frutas.filter(f => f.nombre.toLowerCase().includes(valorBusqueda));

    mostrarProductos(productosFiltrados);
}



function agregarACarrito(id){

    let frutaSeleccionada = frutas.find(f => f.id === id);

    carrito.push(frutaSeleccionada);

    guardarCarrito();

    console.log(carrito);

    console.log(`id del producto: ${id}`);

    mostrarCarrito();
}



function mostrarCarrito(){

    let cartaCarrito = "<h2>Carrito</h2>";
    let total = 0;

    if(carrito.length === 0) {
        cartaCarrito += "<p>El carrito está vacío</p>";
        cartaCarrito += `<div class="total-contenedor">Total: $0</div>`;
        document.querySelector("#contadorCarrito").innerHTML = "Carrito: 0 productos";
        contenedorCarrito.innerHTML = cartaCarrito;
    return;
    }

    cartaCarrito += "<ul>";
    
    carrito.forEach((elemento, indice) => {
        total += elemento.precio;
        cartaCarrito +=
        `<li class="bloque-item">
            <p class="nombre-item">${elemento.nombre} - $ ${elemento.precio}</p>
            <button class="boton-eliminar" onclick="eliminarProducto(${indice})">Eliminar</button>
        </li>`
        
    });

    cartaCarrito += `</ul><button class ="boton-vaciar" onclick='vaciarCarrito()'> Vaciar carrito </button>`;

    cartaCarrito += `<div class="total-contenedor">Total: $${total}</div>`;

    contenedorCarrito.innerHTML = cartaCarrito;

    document.querySelector("#contadorCarrito").innerHTML = `Carrito: ${carrito.length} productos`;

    console.log(cartaCarrito);

    console.table(carrito);
}


function eliminarProducto(indice){

    carrito.splice(indice, 1);

    guardarCarrito();

    console.table(carrito);

    mostrarCarrito();
    
}



function vaciarCarrito(){
    carrito = [];

    guardarCarrito();

    mostrarCarrito();
}



function guardarCarrito(){

    let carritoActualizado = JSON.stringify(carrito);
    localStorage.setItem("carrito", carritoActualizado);
}


function cargarCarrito(){

    const carritoGuardado = localStorage.getItem("carrito");
        if (carritoGuardado) {
            carrito = JSON.parse(carritoGuardado);
            mostrarCarrito();
    }
}


function imprimirDatosAlumno(){
    const alumno = {
        nombre : "Martin",
        apellido: "Esquivel",
        dni : 46703881
    }

    console.log(`Nombre: ${alumno.nombre}, apellido: ${alumno.apellido}, dni : ${alumno.dni}`);

    document.querySelector("#nombreAlumno").textContent = `${alumno.nombre} ${alumno.apellido}`;

}


function ordenarPorNombre(){

    const nombresOrdenados = frutas.map(fruta => fruta.nombre).sort();
    
    const frutasOrdenadas = nombresOrdenados.map(nombre => frutas.find(fruta => fruta.nombre === nombre));

    mostrarProductos(frutasOrdenadas);
}


function ordenarPorPrecio() {
    const frutasOrdenadasPorPrecio = frutas.slice().sort((a, b) => a.precio - b.precio);
    mostrarProductos(frutasOrdenadasPorPrecio);
}


function init(){
    
    mostrarProductos(frutas);
    cargarCarrito();
    imprimirDatosAlumno();

}

init();



*/

